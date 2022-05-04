import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood{
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;

}

interface AddFood{
  image: string;
  name: string;
  price: string;
  descriprion: string;
}



export default function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [foodEditing, setFoodEditing]= useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  useEffect(() => {
    async function getFood(){
      const response = await api.get('/foods');

      setFoods(response.data)
    }
    getFood()
  },[])

 const handleAddFood = async (food: AddFood): Promise<void>  => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

     setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

 const handleUpdateFood = async (food: AddFood): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${foodEditing.id}`,
        { ...foodEditing, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

 const handleDeleteFood = async (id:number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food:IFood) => food.id !== id);

    setFoods(foodsFiltered);
  }

 const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

 const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }


const  handleEditFood = (food: IFood) => {
    setEditModalOpen(true)  
    setFoodEditing(food)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={foodEditing}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food:IFood) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}



 

  

  
  


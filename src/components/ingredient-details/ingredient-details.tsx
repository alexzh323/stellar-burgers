import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredientsData } from '../../services/slices/ingredients'

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredientsData = useSelector(selectIngredientsData);
  const {id} = useParams<{ id: string }>()
  const ingredientData = ingredientsData.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

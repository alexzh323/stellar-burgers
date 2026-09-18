import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrders,
  getFeedsApiThunk,
  selectOrderByNumber,
  getOrderByNumberApiThunk
} from '../../services/slices/feed';
import { selectIngredientsData } from '../../services/slices/ingredients';
import {
  selectProfoleOrders,
  getProfileOrdersThunk
} from '../../services/slices/user';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const isProfileOrder = location.pathname.includes('/profile');
  const publicOrders = useSelector(selectOrders);
  const profileOrders = useSelector(selectProfoleOrders);
  const orders = isProfileOrder ? profileOrders : publicOrders;
  const orderByNumber = useSelector(selectOrderByNumber);

  useEffect(() => {
    if (number && !orders.length) {
      dispatch(getOrderByNumberApiThunk(parseInt(number, 10)));
    }
  }, [number, orders, dispatch]);

  const orderData = useMemo(() => {
    if (!number) return null;
    const foundOrder = orders.find(
      (item) => item.number === parseInt(number, 10)
    );
    return foundOrder || orderByNumber;
  }, [orders, number, orderByNumber]);

  const ingredients: TIngredient[] = useSelector(selectIngredientsData);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

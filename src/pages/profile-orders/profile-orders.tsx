import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectProfoleOrders,
  getProfileOrdersThunk
} from '../../services/slices/user';
import { useEffect } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectProfoleOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileOrdersThunk());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};

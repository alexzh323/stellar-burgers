import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectOrders, getFeedsApiThunk } from '../../services/slices/feed';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);

  useEffect(() => {
    dispatch(getFeedsApiThunk())
  },[]);

  if (!orders.length) {
    return <Preloader />;
  };

  return <FeedUI orders={orders} handleGetFeeds={() => {dispatch(getFeedsApiThunk())}} />;
};

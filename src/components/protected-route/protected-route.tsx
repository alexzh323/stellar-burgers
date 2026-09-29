import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthChecked } from '../../services/slices/user';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  if (!isAuthChecked) {
    return <Preloader />;
  } else if (onlyUnAuth && user) {
    return <Navigate replace to={from} />;
  } else if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  } else {
    return children;
  }
};

import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import {useDispatch, useSelector} from '../../services/store'
import { loginUserApiThunk, selectUserError } from '../../services/slices/user';

export const Login: FC = () => {
  const error = useSelector(selectUserError);
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserApiThunk({email, password}));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

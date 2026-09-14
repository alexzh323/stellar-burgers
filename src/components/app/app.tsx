import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useLocation } from 'react-router-dom';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { AppHeader, Modal,OrderInfo,IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { Feed, Login,Register,ForgotPassword,ResetPassword,Profile,ProfileOrders,NotFound404 } from '@pages';
import {ProtectedRoute} from'../protected-route/protected-route'

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = false;
  const ingredients = [];
  const error = null;
  const location = useLocation()
  const backgroundLocation = location.state?.background;
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1);
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : 
      (
        <>
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage/>}/>
            <Route path='/feed' element={<Feed/>}/>
            <Route path='/login' element={<ProtectedRoute onlyUnAuth><Login/></ProtectedRoute>}/>
            <Route path='/register' element={<ProtectedRoute onlyUnAuth><Register/></ProtectedRoute>}/>
            <Route path='/forgot-password' element={<ProtectedRoute onlyUnAuth><ForgotPassword/></ProtectedRoute>}/>
            <Route path='/reset-password' element={<ProtectedRoute onlyUnAuth><ResetPassword/></ProtectedRoute>}/>
            <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders/></ProtectedRoute>}/>
            <Route path='*' element={<NotFound404/>}/>
          </Routes>

          { backgroundLocation &&
            <Routes>
              <Route path='/feed/:number' element={<Modal title='Информация о заказе' onClose={handleClose}><OrderInfo/></Modal>}/>
              <Route path='/ingredients/:id' element={<Modal title='Детали ингредиента' onClose={handleClose}><IngredientDetails/></Modal>}/>
              <Route path='/profile/orders/:number' element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={handleClose}><OrderInfo/></Modal>
              </ProtectedRoute>}/>
            </Routes>
          }
        </>

      //ingredients.length > 0 ? (
        //<ConstructorPage />
      //) : 
      //(
        //<div className={`${styles.title} text text_type_main-medium pt-4`}>
        //  Нет игредиентов
        //</div>
      )}
      
    </div>
  );
};

export default App;



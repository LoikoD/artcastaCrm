import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAttrTypes, logout, selectSettingsMenu } from './redux/actions'
import { Outlet, useNavigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import CategoryNavigation from './CategoryNavigation';
import { categoriesLoad, openCategory } from './redux/actions';
import { SettingsMenu } from './redux/enums';

import './styles/Layout.css';

function Layout() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => {
    const { authReducer } = state;
    return authReducer.user;
  });

  const categories = useSelector(state => {
    const { navigationReducer } = state;
    return navigationReducer.categories;
  });

  const handleLogout = () => {
    dispatch(logout());
  }
  const handleSettings = () => {
    dispatch(openCategory(null));
    dispatch(selectSettingsMenu(SettingsMenu.CONF));
    navigate('/configure');
  }
  const handleHome = () => {
    const category = categories.length > 0 ? categories[0] : null
    dispatch(openCategory(category));
    navigate('/');
  }
  const handleProfile = () => {
    dispatch(openCategory(null));
    navigate('/profile');
  }

  useEffect(() => {
    dispatch(categoriesLoad());
    dispatch(loadAttrTypes());
  }, [dispatch]);

  return (
    <div className='layout'>
      <div className='header'>
        <div className='header-name' onClick={() => handleHome()}>
          <h3>
            ARTCasta
          </h3>
        </div>
        <div className='header-right'>
          <div className='settings' onClick={() => handleSettings()}>Настройки</div>
          <div className='username' onClick={() => handleProfile()}>{user?.Username}</div>
          <button className='logout-btn' onClick={() => handleLogout()}>Выход</button>
        </div>
      </div>
      <RequireAuth>
        <div className='container'>
          <CategoryNavigation />
          <Outlet />
        </div>
      </RequireAuth>
    </div>
  );
};

export default Layout;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/actions'
import { Outlet, useNavigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import CategoryNavigation from './CategoryNavigation';
import { categoriesLoad, openCategory } from './redux/actions';

import './Layout.css';

function Layout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => {
        const {authReducer} = state;
        return authReducer.user;
      });

    const categories = useSelector(state => {
      const {navigationReducer} = state;
      return navigationReducer.categories;
    });
    useEffect(() => {
        dispatch(categoriesLoad());
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    }
    const handleSettings = () => {
      dispatch(openCategory(null));
      navigate('/settings');
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

    return (
      <div width='100%'>
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
            <CategoryNavigation/>
            <Outlet />
          </div>
        </RequireAuth>
      </div>
    );
};

export default Layout;
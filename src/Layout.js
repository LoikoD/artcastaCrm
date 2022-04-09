import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/actions'
import { Outlet, useNavigate, Link } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import './Layout.css';

function Layout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.user;
      });

    const handleLogout = (e) => {
        dispatch(logout());
    }

    return (
      <div width='100%'>
        <div className='header'>
          <Link to='/' className='header-name'>
            <h3>
              ARTCasta
            </h3>
          </Link>
          <div className='header-right'>
            <Link className='settings' to='/settings'>Настройки</Link>
            <Link className='username' to='/profile'>{user?.Username}</Link>
            <button className='logout-btn' onClick={(e) => handleLogout(e)}>Выход</button>
          </div>
        </div>
        <RequireAuth>
          <Outlet />
        </RequireAuth>
      </div>
    );
};

export default Layout;
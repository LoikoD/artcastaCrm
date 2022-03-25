
import {Home} from './Home';
import TablePage from './TablePage';
import CategoryNavigation from './CategoryNavigation';
import TableNavigation from './TableNavigation';
import Login from './Login';
import { categoriesLoad, tablesLoad, logout } from './redux/actions'
import { useDispatch, useSelector} from 'react-redux';
import { useState, useEffect } from 'react';
import './App.css';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import userEvent from '@testing-library/user-event';

function App(props) {
  
  const dispatch = useDispatch();
  
  const tables = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.tables;
  });

  const categories = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.categories;
  });

  const currentTable = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.currentTable;
  });

  const loggedIn = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.loggedIn;
  });

  const user = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.user;
  });

  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, null, "/");
      window.location.reload();
    }
    dispatch(categoriesLoad());
    dispatch(tablesLoad());
  }, []);

  const handleLogout = (e) => {
    dispatch(logout());
  }

  return (
    <div>
      
    {loggedIn === 1 ?
      <div width='100%'>
        <div className='header'>

          <h3 className='header-name'>
            ARTCasta
          </h3>
          <div className='header-right'>
            <div className='username'>{user.Username}</div>
            <button className='logout-btn' onClick={(e) => handleLogout(e)}>Выход</button>
          </div>
        </div>
        <div className='container'>
          <CategoryNavigation/>
          <TableNavigation/>

          {tables.length > 0 ? <TablePage/> : <div className='empty-category'>В базе отсутствуют таблицы.</div>}
          

        </div>
      </div>
      : <Login/>
    }
    </div>

  );
}

export default App;

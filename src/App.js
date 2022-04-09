import Login from './Login';
import TableLayout from './TableLayout';
import Settings from './Settings';
import Layout from './Layout';
import Profile from './Profile';
import ViewRow from './ViewRow';
import { tryLogin } from './redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TablePage from './TablePage';
import './styles/App.css';

function App(props) {
  
  const dispatch = useDispatch();

  const [show, setShow] = useState(0);
  
  const loggedIn = useSelector(state => {
    const {authReducer} = state;
    return authReducer.loggedIn;
  });

  const firstLoad = useSelector(state => {
    const {authReducer} = state;
    return authReducer.firstLoad;
  });

  useEffect(() => {
    if (window.location.pathname === '/view_row') {
      window.history.replaceState(null, null, '/');
    }

    dispatch(tryLogin());
  }, []);

  useEffect(() => {
    if (firstLoad === 0) {
      setShow(1);
    }
  }, [firstLoad, loggedIn]);


  return (
    show === 0 ?
    <></>
    :
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />}/>
          <Route element={<Layout />}>
            <Route element={<TableLayout />} >
              <Route exact path="/" element={<TablePage />} />
              <Route exact path="/view_row" element={<ViewRow />} />
            </Route>
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

  );
}



export default App;

import Login from './Login';
import Home from './Home';
import Settings from './Settings';
import Layout from './Layout';
import Profile from './Profile';
import ViewRow from './ViewRow';
import { tryLogin } from './redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

function App(props) {
  
  const dispatch = useDispatch();

  const [show, setShow] = useState(0);
  
  const loggedIn = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.loggedIn;
  });

  const firstLoad = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.firstLoad;
  });

  useEffect(() => {
    console.log("loading..");
    console.log('path: ', window.location.pathname);
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
            <Route exact path="/" element={<Home />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/view_row" element={<ViewRow />} />
          </Route>
          <Route path="*" element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

  );
}



export default App;

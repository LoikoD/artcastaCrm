import Login from './Login';
import TableLayout from './TableLayout';
import Settings from './Settings';
import Layout from './Layout';
import Profile from './Profile';
import ViewRow from './ViewRow';
import ConfigureCategories from './ConfigureCategories';
import UsersSettings from './UsersSettings';
import RolesSettings from './RolesSettings';
import { tryLogin } from './redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TablePage from './TablePage';
import './styles/App.css';
import { ViewMods } from './redux/enums';
import ConfigureTables from './ConfigureTables';
import ViewCategory from './ViewCategory';

function App(props) {

  const dispatch = useDispatch();

  const [show, setShow] = useState(0);

  const loggedIn = useSelector(state => {
    const { authReducer } = state;
    return authReducer.loggedIn;
  });

  const firstLoad = useSelector(state => {
    const { authReducer } = state;
    return authReducer.firstLoad;
  });

  useEffect(() => {
    const redirectNames = ['/view_row', '/add_row', '/configure/tables', '/configure/view_category', '/configure/add_category']
    if (redirectNames.includes(window.location.pathname)) {
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
          <Route exact path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<TableLayout />} >
              <Route exact path="/" element={<TablePage />} />
              <Route exact path="/view_row" element={<ViewRow mode={ViewMods.VIEW} />} />
              <Route exact path="/add_row" element={<ViewRow mode={ViewMods.ADD} />} />
            </Route>
            <Route element={<Settings />} >
              <Route exact path="/configure" element={<ConfigureCategories />} />
              <Route exact path="/configure/edit_category" element={<ViewCategory mode={ViewMods.VIEW} />} />
              <Route exact path="/configure/add_category" element={<ViewCategory mode={ViewMods.ADD} />} />
              <Route exact path="/configure/tables" element={<ConfigureTables />} />
              <Route exact path="/users" element={<UsersSettings />} />
              <Route exact path="/roles" element={<RolesSettings />} />
            </Route>
            <Route exact path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

  );
}



export default App;

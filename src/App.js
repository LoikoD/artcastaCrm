import Login from './Login';
import TableLayout from './TableLayout';
import Settings from './Settings';
import Profile from './Profile';
import ViewRow from './ViewRow';
import ConfigureCategories from './ConfigureCategories';
import UsersSettings from './UsersSettings';
import RolesSettings from './RolesSettings';
import { tryLogin } from './redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TablePage from './TablePage';
import { ViewMods } from './redux/enums';
import ConfigureTables from './ConfigureTables';
import ViewCategory from './ViewCategory';
import './styles/App.css';
import ViewTable from './ViewTable';
import ConfigureAttributes from './ConfigureAttributes';
import ViewAttribute from './ViewAttribute';
import ConfigureSettings from './ConfigureSettings';
import RolesList from './RolesList';
import LoadingOverlay from './LoadingOverlay';

function App(props) {

  const dispatch = useDispatch();

  const [show, setShow] = useState(0);

  const Layout = React.lazy(() => import('./Layout'));
  const ViewRole = React.lazy(() => import('./ViewRole'));
  const ViewUser = React.lazy(() => import('./ViewUser'));
  const UsersList = React.lazy(() => import('./UsersList'));

  const loggedIn = useSelector(state => {
    const { authReducer } = state;
    return authReducer.loggedIn;
  });

  const firstLoad = useSelector(state => {
    const { authReducer } = state;
    return authReducer.firstLoad;
  });

  useEffect(() => {
    const redirectToHomeNames = ['/view_row', '/add_row'];
    const redirectToConfNames =
      [
        '/configure/tables',
        '/configure/edit_category',
        '/configure/edit_table',
        '/configure/add_table',
        '/configure/attributes',
        '/configure/edit_attribute',
        '/configure/add_attribute'
      ];
    if (redirectToHomeNames.includes(window.location.pathname)) {
      window.history.replaceState(null, null, '/');
    } else if (redirectToConfNames.includes(window.location.pathname)) {
      window.history.replaceState(null, null, '/configure');
    } else if (window.location.pathname.startsWith('/roles/')) {
      window.history.replaceState(null, null, '/roles');
    }
    else if (window.location.pathname.startsWith('/users/')) {
      window.history.replaceState(null, null, '/users');
    }

    dispatch(tryLogin());
  }, [dispatch]);

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
        <Suspense fallback={<LoadingOverlay show={1} />}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route element={<TableLayout />} >
                <Route exact path="/" element={<TablePage />} />
                <Route exact path="/view_row" element={<ViewRow mode={ViewMods.VIEW} />} />
                <Route exact path="/add_row" element={<ViewRow mode={ViewMods.ADD} />} />
              </Route>
              <Route element={<Settings />} >
                <Route element={<ConfigureSettings />} >
                  <Route exact path="/configure" element={<ConfigureCategories />} />
                  <Route exact path="/configure/edit_category" element={<ViewCategory mode={ViewMods.VIEW} />} />
                  <Route exact path="/configure/add_category" element={<ViewCategory mode={ViewMods.ADD} />} />
                  <Route exact path="/configure/tables" element={<ConfigureTables />} />
                  <Route exact path="/configure/edit_table" element={<ViewTable mode={ViewMods.VIEW} />} />
                  <Route exact path="/configure/add_table" element={<ViewTable mode={ViewMods.ADD} />} />
                  <Route exact path="/configure/attributes" element={<ConfigureAttributes />} />
                  <Route exact path="/configure/edit_attribute" element={<ViewAttribute mode={ViewMods.VIEW} />} />
                  <Route exact path="/configure/add_attribute" element={<ViewAttribute mode={ViewMods.ADD} />} />
                </Route>
                <Route element={<UsersSettings />} >
                  <Route exact path="/users" element={<UsersList />} />
                  <Route exact path="/users/edit_user/:userId" element={<ViewUser mode={ViewMods.VIEW} />} />
                  <Route exact path="/users/add_user" element={<ViewUser mode={ViewMods.ADD} />} />
                </Route>
                <Route element={<RolesSettings />} >
                  <Route exact path="/roles" element={<RolesList />} />
                  <Route exact path="/roles/edit_role/:roleId" element={<ViewRole mode={ViewMods.VIEW} />} />
                  <Route exact path="/roles/add_role" element={<ViewRole mode={ViewMods.ADD} />} />
                </Route>
              </Route>
              <Route exact path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </Router>

  );
}



export default App;

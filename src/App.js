
import {Home} from './Home';
import TablePage from './TablePage';
import CategoryNavigation from './CategoryNavigation';
import TableNavigation from './TableNavigation';
import { categoriesLoad, tablesLoad } from './redux/actions'
import { useDispatch, useSelector} from 'react-redux';
import { useState, useEffect } from 'react';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App(props) {

  //const [tableName, setTableName] = useState('');
  
  const dispatch = useDispatch();
  
  const allTables = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.allTables;
  });

  const categories = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.categories;
  });

  const currentTable = useSelector(state => {
    const {navigationReducer} = state;
    return navigationReducer.currentTable;
  });

  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, null, "/");
      window.location.reload();
    }
    dispatch(categoriesLoad());
    dispatch(tablesLoad());
  }, []);

  useEffect(() => {
    if (currentTable.CategoryId != null && currentTable.TableId != null) {
      window.history.replaceState(null, null, "/category/"+currentTable.CategoryId+"/table/"+currentTable.TableId);
    }
  }, [currentTable]);

  return (
    <BrowserRouter>
      <div className="container">
        <h3 className='m-3 d-flex justify-content-center'>
          ARTCasta
        </h3>
      
        <CategoryNavigation/>
        <TableNavigation/>

        <TablePage/>
      </div>
    </BrowserRouter>
  );
}

export default App;

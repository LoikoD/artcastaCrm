import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { categoriesLoad, tablesLoad } from './redux/actions'
import TablePage from './TablePage';
import CategoryNavigation from './CategoryNavigation';
import TableNavigation from './TableNavigation';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import LoadingOverlay from './LoadingOverlay';


function Home() {  

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
      });
    
    const tables = useSelector(state => {
      const {navigationReducer} = state;
      return navigationReducer.tables;
    });
    
    const categories = useSelector(state => {
      const {navigationReducer} = state;
      return navigationReducer.categories;
    });
    
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [tablesLoading, setTablesLoading] = useState(1);
    

    useEffect(() => {
        setCategoriesLoaded(false);
        setTablesLoading(1);
        dispatch(categoriesLoad());
        dispatch(tablesLoad());
    }, []);

    useEffect(() => {
        if (categories?.length > 0) {
            setCategoriesLoaded(true);
        }
    }, [categories]);

    useEffect(() => {
        if (JSON.stringify(currentTable) !== JSON.stringify({})) {
            setTablesLoading(0);
        }
    }, [currentTable]);

    return (
        (categoriesLoaded) ?
            <div className='container'>
                <CategoryNavigation/>
                <div>
                    <LoadingOverlay show={tablesLoading} />
                    <TableNavigation/>
                </div>
            </div>
        : <>Loading</>
    );
};

export default Home;
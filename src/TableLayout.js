import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { tablesLoad } from './redux/actions'
import TableNavigation from './TableNavigation';
import LoadingOverlay from './LoadingOverlay';
import './styles/TableLayout.css';


function Home() {  

    const dispatch = useDispatch();

    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    });
    
    const [tablesLoading, setTablesLoading] = useState(1);
    

    useEffect(() => {
        setTablesLoading(1);
        dispatch(tablesLoad());
    }, []);

    useEffect(() => {
        if (JSON.stringify(currentTable) !== JSON.stringify({})) {
            setTablesLoading(0);
        }
    }, [currentTable]);

    return (
        <div>
            <LoadingOverlay show={tablesLoading} />
            <TableNavigation/>
        </div>
    );
};

export default Home;
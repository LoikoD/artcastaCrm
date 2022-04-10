import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { openTable, setLoadingState } from './redux/actions';
import { Outlet, useNavigate } from 'react-router-dom';
import './styles/Navigation.css';

function TableNavigation() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tables = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.tables;
    });
    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    });
    const [selectedTable, setSelectedTable] = useState(currentTable);
    const handleClickTab = (e, table) => {
        e.preventDefault();

        setSelectedTable(table);
        dispatch(setLoadingState(1));
        dispatch(openTable(table));
        navigate('/');
    };

    useEffect(() => {
        if (JSON.stringify(currentTable) !== JSON.stringify({})) {
            setSelectedTable(currentTable);
            dispatch(setLoadingState(0));
        }
    }, [currentTable]);

    return(
        <>
            <div className='bloc-table-tabs'>
                
                {tables.map(table=>
                    <button key={table.TableId} className={selectedTable?.TableId === table.TableId ? 'table-tabs active-table-tabs' : 'table-tabs'} onClick={(e) => handleClickTab(e, table)}>
                        {table.TableName}
                    </button>
                )}

            </div>
            <Outlet />
        </>
    )
}

export default TableNavigation;
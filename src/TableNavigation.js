import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { openTable } from './redux/actions';
import TablePage from './TablePage';
import LoadingOverlay from './LoadingOverlay';
import './Navigation.css';

function TableNavigation() {

    const dispatch = useDispatch();

    const tables = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.tables;
    });
    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    });
    const [selectedTable, setSelectedTable] = useState(currentTable);
    const [loadingTable, setLoadingTable] = useState(1);
    const handleClickTab = (e, table) => {
        setLoadingTable(1);
        setSelectedTable(table);
        dispatch(openTable(table));
    }

    useEffect(() => {
        if (JSON.stringify(currentTable) !== JSON.stringify({})) {
            setSelectedTable(currentTable);
            setLoadingTable(0);
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
            <LoadingOverlay show={loadingTable} />
            {JSON.stringify(currentTable) !== JSON.stringify({}) ? 
                tables.length > 0 ? <TablePage/> : <div className='empty-category'>В базе отсутствуют таблицы.</div>
                : <></>
            }
        </>
    )
}

export default TableNavigation;
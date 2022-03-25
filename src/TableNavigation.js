import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar,Nav} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import { openTable } from './redux/actions';
import { tab } from '@testing-library/user-event/dist/tab';
import './Navigation.css';

function TableNavigation(props) {

    const dispatch = useDispatch();

    const tables = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.tables;
    }); 
    const currentCategory = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentCategory;
    }); 
    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    }); 
    const handleClickTab = (e, table) => {
        dispatch(openTable(table));
    }

    return(
        <div className='bloc-table-tabs'>

            {tables.map(table=>
                <button key={table.TableId} className={currentTable.TableId === table.TableId ? 'table-tabs active-table-tabs' : 'table-tabs'} onClick={(e) => handleClickTab(e, table)}>
                    {table.TableName}
                </button>
            )}

        </div>
    )
}

export default TableNavigation;
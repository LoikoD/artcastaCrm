import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar,Nav} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import { openTable } from './redux/actions';

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
    const handleClickTab = (e, table) => {
        dispatch(openTable(table));
    }

    return(
        <Navbar bg="dark" expand='lg'>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav>
                    {tables.map(table=>
                        <NavLink key={table.TableId} className='d-inline p-2 bg-dark text-white' onClick={(e) => handleClickTab(e, table)} to={`/category/${currentCategory.CategoryId}/table/${table.TableId}`}>
                            {table.TableName}
                        </NavLink>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default TableNavigation;
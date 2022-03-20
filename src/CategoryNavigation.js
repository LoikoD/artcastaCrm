import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar,Nav} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import { openCategory, openTable } from './redux/actions';
import { useEffect } from 'react';

function CategoryNavigation(props) {

    const dispatch = useDispatch();

    const categories = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.categories;
      });

    const allTables = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.allTables;
    }); 
    const handleClickTab = (e, category) => {
        dispatch(openCategory(category));
        const table = allTables.find(table => table.CategoryId == category.CategoryId);
        if (table) {
            dispatch(openTable(table));
        }
    }


    return(
        <Navbar bg="dark" expand='lg'>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav>
                    <NavLink className='d-inline p-2 bg-dark text-white' onClick={(e) => handleClickTab(e, {})} to='/'>
                        Home
                    </NavLink>
                    {categories.map(category=>
                        <NavLink key={category.CategoryId} className='d-inline p-2 bg-dark text-white' onClick={(e) => handleClickTab(e, category)}
                                 to={`/category/${category.CategoryId}/table/${allTables.find(table => table.CategoryId == category.CategoryId) ? allTables.find(table => table.CategoryId == category.CategoryId).TableId : ""}`}>
                            {category.CategoryName}
                        </NavLink>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default CategoryNavigation;
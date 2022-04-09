import React from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { openCategory, openTable } from './redux/actions';
import { useEffect } from 'react';
import './Navigation.css';

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

    const currentCategory = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentCategory;
    });

    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    });

    const handleClickTab = (e, category) => {
        dispatch(openCategory(category));
        if (!currentTable || currentTable?.CategoryId !== category.CategoryId) {
            const table = allTables.find(table => table.CategoryId === category.CategoryId);
            if (table) {
                dispatch(openTable(table));
            }
        }
    };

    return (
        <div className='bloc-tabs'>

            {categories.map(category=>
                <button key={category.CategoryId} className={currentCategory.CategoryId === category.CategoryId ? 'tabs active-tabs active-tabs-category' : 'tabs'} onClick={(e) => handleClickTab(e, category)}>
                    {category.CategoryName}
                </button>
            )}

        </div>
    );
}

export default CategoryNavigation;
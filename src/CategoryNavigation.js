import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { openCategory, openTable, setLoadingState } from './redux/actions';
import './styles/Navigation.css';
import { useNavigate } from 'react-router-dom';
import useAccessCategories from './hooks/useAccessCategories';

function CategoryNavigation(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();


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

    const accessCategories = useAccessCategories();


    const handleClickTab = (e, category) => {
        dispatch(setLoadingState(1));
        dispatch(openCategory(category));
        if (!currentTable || currentTable?.CategoryId !== category.CategoryId) {
            const table = allTables.find(table => table.CategoryId === category.CategoryId);
            dispatch(openTable(table));
            if (!table) {
                dispatch(setLoadingState(0));
            }
        } else {
            dispatch(setLoadingState(0));
        }
        navigate('/');
    };

    useEffect(() => {
        if (JSON.stringify(currentTable) !== JSON.stringify({})) {
            dispatch(setLoadingState(0));
        }
    }, [currentTable, dispatch]);

    return (
        <div className='bloc-tabs'>

            {categories.map(category=>
                accessCategories?.find(ac => ac.Id === category.CategoryId) &&
                <button key={category.CategoryId} className={currentCategory?.CategoryId === category.CategoryId ? 'tabs active-tabs active-tabs-category' : 'tabs'} onClick={(e) => handleClickTab(e, category)}>
                    {category.CategoryName}
                </button>
            )}

        </div>
    );
}

export default CategoryNavigation;
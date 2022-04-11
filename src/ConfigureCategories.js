import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openConfCategory, setLoadingState, tablesLoad, updateCategories } from './redux/actions';
import './styles/Configure.css';

function ConfigureCategories() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.categories;
    });

    const sortByOrd = (a, b) => (
        (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)
    );

    const [sortedCategories, setSortedCategories] = useState([...categories].sort((a, b) => sortByOrd(a, b)));


    const handleMoveUp = async (itemOrder) => {
        if (itemOrder === 1) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedCategories];
        changed[itemOrder - 1] = { ...changed[itemOrder - 1], Ord: itemOrder - 1 };
        changed[itemOrder - 2] = { ...changed[itemOrder - 2], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateCategories([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });

    };

    const handleMoveDown = (itemOrder) => {
        if (itemOrder === sortedCategories.length) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedCategories];
        changed[itemOrder - 1] = { ...changed[itemOrder - 1], Ord: itemOrder + 1 };
        changed[itemOrder] = { ...changed[itemOrder], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateCategories([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });
    };

    const handleDelete = (category) => {
        console.log('deleting category: ', category);
    };

    const handleEdit = (category) => {
        console.log('editing category: ', category);
    };

    const handleOpenCategory = (category) => {
        console.log('open category: ', category);
        dispatch(setLoadingState(1));
        dispatch(tablesLoad()).then(() => {
            dispatch(openConfCategory(category)).then(() => {
                dispatch(setLoadingState(0));
                navigate('/configure/tables');
            })
        });
    };

    useEffect(() => {
        setSortedCategories([...categories].sort((a, b) => sortByOrd(a, b)));
    }, [categories]);

    useEffect(() => {
        dispatch(setLoadingState(0));
    }, []);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                <h4 className='category-header'>Категории</h4>
                <div>
                    {sortedCategories.map(category =>
                        <div key={category.CategoryId} className='category-block'>

                            <div className='conf-cat-name-block' onClick={() => handleOpenCategory(category)}>
                                <button
                                    className='conf-move-arrow'
                                    onClick={() => handleMoveUp(category.Ord)}
                                    disabled={category.Ord === 1 ? true : false} >
                                    ↑
                                </button >
                                <button
                                    className='conf-move-arrow'
                                    onClick={() => handleMoveDown(category.Ord)}
                                    disabled={category.Ord === sortedCategories.length ? true : false} >
                                    ↓
                                </button >
                                <div className='conf-cat-name'>
                                    <div>{category.Ord}.&nbsp;</div>
                                    <div>{category.CategoryName}</div>
                                </div>
                            </div>

                            <div className='conf-cat-btn-block'>
                                <button
                                    className='conf-btn edit-conf-btn'
                                    onClick={() => handleEdit(category)}
                                >Редактировать</button>
                                <button
                                    className='conf-btn delete-conf-btn'
                                    onClick={() => window.confirm('Внимание! Удаление категории приведет к удалению всех таблиц с данными внутри этой категории. Вы действительно хотите удалить категорию?') ? handleDelete(category) : null}
                                >Удалить</button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className='conf-btn add-conf-btn'
                >Добавить категорию</button>
            </div>
        </div>
    );
};

export default ConfigureCategories;
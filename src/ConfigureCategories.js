import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCategory, openConfCategory, setLoadingState, tablesLoad, updateCategories } from './redux/actions';
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
        dispatch(deleteCategory(category)).then((result) => {
            console.log(result);
            dispatch(setLoadingState(0));
        })
    };

    const handleEdit = (category) => {
        dispatch(setLoadingState(1));
        console.log('editing category: ', category);
        dispatch(openConfCategory(category)).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/edit_category');
        })
    };

    const handleAdd = () => {
        dispatch(setLoadingState(1));
        console.log('adding category');
        dispatch(openConfCategory({})).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/add_category');
        })
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
                <h4 className='conf-header'>Категории</h4>
                <div>
                    {sortedCategories.map(category =>
                        <div key={category.CategoryId} className='conf-block'>

                            <div className='conf-cat-name-block' >
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
                                <div className='conf-name' onClick={() => handleOpenCategory(category)}>
                                    <div>{category.Ord}.&nbsp;</div>
                                    <div>{category.CategoryName}</div>
                                </div>
                            </div>

                            <div className='conf-btn-block'>
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
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn add-conf-btn'
                        onClick={() => handleAdd()}
                    >Добавить категорию</button>
                </div>
            </div>
        </div>
    );
};

export default ConfigureCategories;
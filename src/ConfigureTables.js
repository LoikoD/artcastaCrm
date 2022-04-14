import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteTable, openConfTable, setLoadingState, updateTables } from './redux/actions';
import './styles/Configure.css';

function ConfigureTables() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const confCategory = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confCategory;
    });

    const allTables = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.allTables;
    });

    const sortByOrd = (a, b) => (
        (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)
    );

    const [tables, setTables] = useState(allTables.filter(table => table.CategoryId === confCategory?.CategoryId));
    const [sortedTables, setSortedTables] = useState([...tables].sort((a, b) => sortByOrd(a, b)));


    const handleMoveUp = async (itemOrder) => {
        if (itemOrder === 1) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedTables];
        changed[itemOrder - 1] = { ...changed[itemOrder - 1], Ord: itemOrder - 1 };
        changed[itemOrder - 2] = { ...changed[itemOrder - 2], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateTables([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });

    };

    const handleMoveDown = (itemOrder) => {
        if (itemOrder === sortedTables.length) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedTables];
        changed[itemOrder - 1] = { ...changed[itemOrder - 1], Ord: itemOrder + 1 };
        changed[itemOrder] = { ...changed[itemOrder], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateTables([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });
    };

    const handleDelete = (table) => {
        console.log('deleting table: ', table);
        dispatch(setLoadingState(1));
        dispatch(deleteTable(table)).then((result) => {
            console.log(result);
            dispatch(setLoadingState(0));
        })
    }

    const handleEdit = (table) => {
        console.log('editing table: ', table);
        dispatch(setLoadingState(1));
        dispatch(openConfTable(table)).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/edit_table');
        });
    }

    const handleAdd = () => {
        console.log('adding table');
        dispatch(setLoadingState(1));
        dispatch(openConfTable({})).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/add_table');
        });
    };

    const handleOpenTable = (table) => {
        console.log('open table: ', table);
        dispatch(setLoadingState(1));
        dispatch(openConfTable(table)).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/attributes');
        });
    }

    const handleBack = () => {
        navigate('/configure');
    }

    useEffect(() => {
        setSortedTables([...tables].sort((a, b) => sortByOrd(a, b)));
    }, [tables]);

    useEffect(() => {
        setTables(allTables.filter(table => table.CategoryId === confCategory?.CategoryId));
    }, [allTables, confCategory?.CategoryId]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                <h4 className='conf-header'>Категория:&nbsp;{confCategory.CategoryName}</h4>
                {sortedTables.length > 0 ?
                    <div>
                        {sortedTables.map(table =>
                            <div key={table.TableId} className='conf-block'>

                                <div className='conf-cat-name-block'>
                                    <button
                                        className='conf-move-arrow'
                                        onClick={() => handleMoveUp(table.Ord)}
                                        disabled={table.Ord === 1 ? true : false} >
                                        ↑
                                    </button >
                                    <button
                                        className='conf-move-arrow'
                                        onClick={() => handleMoveDown(table.Ord)}
                                        disabled={table.Ord === sortedTables.length ? true : false} >
                                        ↓
                                    </button >
                                    <div className='conf-name' onClick={() => handleOpenTable(table)}>
                                        <div>{table.Ord}.&nbsp;</div>
                                        <div>{table.TableName}</div>
                                    </div>
                                </div>

                                <div className='conf-btn-block'>
                                    <button
                                        className='conf-btn edit-conf-btn'
                                        onClick={() => handleEdit(table)}
                                    >Редактировать</button>
                                    <button
                                        className='conf-btn delete-conf-btn'
                                        onClick={() => window.confirm('Вы действительно хотите удалить таблицу?') ? handleDelete(table) : null}
                                    >Удалить</button>
                                </div>
                            </div>
                        )}
                    </div>
                    : <div className='conf-no-data'>В данной категории нет таблиц.</div>
                }
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn add-conf-btn'
                        onClick={() => handleAdd()}
                    >Создать таблицу</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к категориям</button>
                </div>
            </div>
        </div>
    );
};

export default ConfigureTables;
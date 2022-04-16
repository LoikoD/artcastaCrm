import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteAttribute, openConfAttribute, setLoadingState, updateAttributes } from './redux/actions';
import './styles/Configure.css';

function ConfigureAttributes() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const confTable = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confTable;
    });

    const allTables = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.allTables;
    });

    const sortByOrd = (a, b) => (
        (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)
    );

    const [table, setTable] = useState(allTables.find(table => table.TableId === confTable.TableId));
    const [sortedAttrs, setSortedAttrs] = useState([...table.Attributes].sort((a, b) => sortByOrd(a, b)));


    const handleMoveUp = async (itemOrder) => {
        if (itemOrder === 1) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedAttrs];
        changed[itemOrder] = { ...changed[itemOrder], Ord: itemOrder - 1 };
        changed[itemOrder - 1] = { ...changed[itemOrder - 1], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateAttributes([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });

    };

    const handleMoveDown = (itemOrder) => {
        if (itemOrder === sortedAttrs.length) {
            return;
        }
        dispatch(setLoadingState(1));
        let changed = [...sortedAttrs];
        changed[itemOrder] = { ...changed[itemOrder], Ord: itemOrder + 1 };
        changed[itemOrder + 1] = { ...changed[itemOrder + 1], Ord: itemOrder };
        let newSorted = [...changed].sort((a, b) => sortByOrd(a, b));

        dispatch(updateAttributes([...newSorted])).then((result) => {
            dispatch(setLoadingState(0));
        });
    };

    const handleDelete = (attr) => {
        console.log('deleting attribute: ', attr);
        dispatch(setLoadingState(1));
        dispatch(deleteAttribute(attr.AttrId)).then((result) => {
            dispatch(setLoadingState(0));
            switch (result) {
                case 0: // success
                    break;
                case 409: // dependent attributes error
                    window.alert("Чтобы удалить этот атрибут, сначала нужно удалить зависимые от него атрибуты");
                    break;
                case 500: // internal server error
                    window.alert("Произошла ошибка во время выполнения запроса!");
                    break;
                default: // other error
                    window.alert("Произошла неизвестная ошибка!");
                    break;
            };
        });
    }

    const handleEdit = (attr) => {
        console.log('editing attribute: ', attr);
        dispatch(setLoadingState(1));
        dispatch(openConfAttribute(attr)).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/edit_attribute');
        });
    }

    const handleAdd = () => {
        console.log('adding attribute');
        dispatch(setLoadingState(1));
        dispatch(openConfAttribute({})).then(() => {
            dispatch(setLoadingState(0));
            navigate('/configure/add_attribute');
        });
    };

    const handleBack = () => {
        navigate('/configure/tables');
    }

    useEffect(() => {
        setTable(allTables.find(table => table.TableId === confTable.TableId));
    }, [allTables, confTable.TableId]);

    useEffect(() => {
        setSortedAttrs([...table.Attributes].sort((a, b) => sortByOrd(a, b)));
    }, [table.Attributes]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                <h4 className='conf-header'>Таблица:&nbsp;{table.TableName}</h4>
                {sortedAttrs.length > 1 ?
                    <div>
                        {sortedAttrs.map(attr =>
                            attr.PkFlag === 1 ? null :
                                <div key={attr.AttrId} className='conf-block'>

                                    <div className='conf-cat-name-block'>
                                        <button
                                            className='conf-move-arrow'
                                            onClick={() => handleMoveUp(attr.Ord)}
                                            disabled={attr.Ord === 1 ? true : false} >
                                            ↑
                                        </button >
                                        <button
                                            className='conf-move-arrow'
                                            onClick={() => handleMoveDown(attr.Ord)}
                                            disabled={attr.Ord === sortedAttrs.length ? true : false} >
                                            ↓
                                        </button >
                                        <div className='conf-name-attr'>
                                            <div>{attr.Ord}.&nbsp;</div>
                                            <div>{attr.AttrName}</div>
                                        </div>
                                    </div>

                                    <div className='conf-btn-block'>
                                        <button
                                            className='conf-btn edit-conf-btn'
                                            onClick={() => handleEdit(attr)}
                                        >Редактировать</button>
                                        <button
                                            className='conf-btn delete-conf-btn'
                                            onClick={() => window.confirm('Вы действительно хотите удалить атрибут?') ? handleDelete(attr) : null}
                                        >Удалить</button>
                                    </div>
                                </div>
                        )}
                    </div>
                    : <div className='conf-no-data'>У данной таблицы еще нет атрибутов.</div>
                }
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn add-conf-btn'
                        onClick={() => handleAdd()}
                    >Добавить атрибут</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к таблицам</button>
                </div>
            </div>
        </div>
    );
};

export default ConfigureAttributes;
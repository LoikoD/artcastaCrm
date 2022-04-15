import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTable, setLoadingState, updateTable } from './redux/actions';
import { ViewMods } from './redux/enums';
import './styles/Configure.css';

function ViewTable(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const confCategory = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confCategory;
    });

    const confTable = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confTable;
    });

    const categories = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.categories;
    });

    const [table, setTable] = useState(props.mode === ViewMods.VIEW ? { ...confTable } : { TableName: "", CategoryId: confCategory.CategoryId });

    const handleInputName = (value) => {
        setTable({ ...table, TableName: value });
    }
    const handleInputCategory = (value) => {
        setTable({ ...table, CategoryId: value });
    }

    const handleSave = async () => {

        dispatch(setLoadingState(1));

        // Проверка на то, что название содержит только кириллицу, латиницу, цифры или пробел, и начинается с буквы
        if (!/^[А-Яа-яЁеA-Za-z]/.test(table.TableName) || /[^А-Яа-яЁеA-Za-z0-9 ]/.test(table.TableName)) {
            // TODO: Выводить ошибку
            console.log("Название должно начинаться с буквы и содержать только кириллицу, латиницу, цифры или пробел");
            dispatch(setLoadingState(0));
            return;
        }

        //TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран
        if (props.mode === ViewMods.VIEW) {
            // update table...
            console.log('updating table...');
            dispatch(updateTable(table)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/configure/tables');
            });
        } else {
            // create table...
            console.log('creating table...');
            dispatch(createTable(table)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/configure/tables');
            });
        }

    }

    const handleBack = () => {
        navigate('/configure/tables');
    }

    useEffect(() => {
        if (confTable && JSON.stringify(confTable) !== JSON.stringify({})) {
            setTable({ ...confTable });
        } else {
            setTable({ TableName: "", CategoryId: confCategory.CategoryId });
        }
    }, [confTable, confCategory.CategoryId]);

    useEffect(() => {
        dispatch(setLoadingState(0));
    }, [dispatch]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                {props.mode === ViewMods.VIEW ? <h4 className='conf-header'>Изменение таблицы: {confTable.TableName}</h4> : <h4 className='conf-header'>Создание таблицы</h4>}
                <div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Название таблицы:</div>
                        <div className='conf-edit-value'>
                            <input
                                type='text'
                                className='str-value-input'
                                value={table.TableName}
                                onChange={(e) => handleInputName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Категория:</div>
                        <div className='conf-edit-value'>
                            <DropdownButton id="dropdown-basic-button" variant='conf-dropdown' title={categories.find(cat => cat.CategoryId === table.CategoryId).CategoryName}>
                                {categories.map((category, index) =>
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => handleInputCategory(category.CategoryId)}
                                        active={table.CategoryId === category.CategoryId}
                                    >{category.CategoryName}
                                    </Dropdown.Item>
                                )}
                            </DropdownButton>
                        </div>
                    </div>

                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn save-conf-btn'
                        onClick={() => handleSave()}
                    >Сохранить</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к таблицам</button>
                </div>
            </div>
        </div>
    );
};

export default ViewTable;
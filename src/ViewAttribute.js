import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Case, Switch } from './helpers/Switch';
import { createAttribute, setLoadingState, updateAttribute } from './redux/actions';
import { ViewMods } from './redux/enums';
import './styles/Configure.css';

function ViewAttribute(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const confCategory = useSelector(state => {
    //     const { configureReducer } = state;
    //     return configureReducer.confCategory;
    // });

    const confTable = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confTable;
    });

    const confAttr = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confAttr;
    });

    const attrTypes = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.attrTypes;
    });

    const allTables = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.allTables;
    });

    const [attr, setAttr] = useState(props.mode === ViewMods.VIEW ? { ...confAttr } : { AttrName: "", AttrTypeId: 1, AttrTypeProp1: 100, AttrTypeProp2: null, TableId: confTable.TableId });
    const [typeChanged, setTypeChanged] = useState(props.mode === ViewMods.VIEW ? false : true);
    const [joinTablesPool, setJoinTablesPool] = useState(allTables.filter(t => t.TableId !== confTable.TableId));
    const [joinAttrsPool, setJoinAttrsPool] = useState(joinTablesPool.find(t => t.TableId === attr.AttrTypeProp1)?.Attributes);
    //const [table, setTable] = useState(props.mode === ViewMods.VIEW ? { ...confTable } : { TableName: "", CategoryId: confCategory.CategoryId });

    const handleInputName = (value) => {
        setAttr({ ...attr, AttrName: value });
    }

    const handleInputAttrType = (attrType) => {
        setTypeChanged(true);
        switch (attrType.SystemAttrTypeName) {
            case "varchar":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: 100, AttrTypeProp2: null });
                break;
            case "text":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: null, AttrTypeProp2: null });
                break;
            case "int":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: null, AttrTypeProp2: null });
                break;
            case "decimal":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: 15, AttrTypeProp2: 2 });
                break;
            case "date":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: null, AttrTypeProp2: null });
                break;
            case "datetime2":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: null, AttrTypeProp2: null });
                break;
            case "join":
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: joinTablesPool[0].TableId, AttrTypeProp2: null });
                break;
            default:
                console.log("ViewAttribute > handleInputAttrType > Error: 'cannot be reached'");
                setAttr({ ...attr, AttrTypeId: attrType.AttrTypeId, AttrTypeProp1: null, AttrTypeProp2: null });
                break;
        }
    }

    const handleInputProp1 = (value) => {
        setAttr({ ...attr, AttrTypeProp1: Number(value) });
    }

    const handleInputProp2 = (value) => {
        setAttr({ ...attr, AttrTypeProp2: Number(value) });
    }

    const handleSave = async () => {

        dispatch(setLoadingState(1));

        // Проверка на то, что название содержит только кириллицу, латиницу, цифры или пробел, и начинается с буквы
        if (!/^[А-Яа-яЁеA-Za-z]/.test(attr.AttrName) || /[^А-Яа-яЁеA-Za-z0-9 ]/.test(attr.AttrName)) {
            // TODO: Выводить ошибку
            console.log("Название должно начинаться с буквы и содержать только кириллицу, латиницу, цифры или пробел");
            dispatch(setLoadingState(0));
            return;
        }

        switch (attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).SystemAttrTypeName) {
            case "varchar":
                if (!/^[1-9]/.test(attr.AttrTypeProp1) || /[^0-9]/.test(attr.AttrTypeProp1) || !(Number(attr.AttrTypeProp1) >= 1 && Number(attr.AttrTypeProp1) <= 255)) {
                    // TODO: Выводить ошибку
                    console.log("Длина строки должна быть в диапазоне от 1 до 255");
                    dispatch(setLoadingState(0));
                    return;
                }
                break;
            case "decimal":
                if (!/^[1-9]/.test(attr.AttrTypeProp1) || /[^0-9]/.test(attr.AttrTypeProp1) || !(Number(attr.AttrTypeProp1) >= 1 && Number(attr.AttrTypeProp1) <= 20)) {
                    // TODO: Выводить ошибку
                    console.log("Общее количество знаков должно быть в диапазоне от 1 до 20");
                    dispatch(setLoadingState(0));
                    return;
                }
                if (!/^[1-9]/.test(attr.AttrTypeProp2) || /[^0-9]/.test(attr.AttrTypeProp2) || !(Number(attr.AttrTypeProp2) >= 0 && Number(attr.AttrTypeProp2) <= 10)) {
                    // TODO: Выводить ошибку
                    console.log("Количество знаков после запятой должно быть в диапазоне от 0 до 10");
                    dispatch(setLoadingState(0));
                    return;
                }
                if (Number(attr.AttrTypeProp1) <= Number(attr.AttrTypeProp2)) {
                    // TODO: Выводить ошибку
                    console.log("Количство знаков после запятой должно быть меньше, чем общее количество знаков");
                    dispatch(setLoadingState(0));
                    return;
                }
                break;
            case "join":
                if (attr.AttrTypeProp1 === null) {
                    // TODO: Выводить ошибку
                    console.log("Таблица для присоединения не может быть пустой");
                    dispatch(setLoadingState(0));
                    return;
                }
                if (attr.AttrTypeProp2 === null) {
                    // TODO: Выводить ошибку
                    console.log("Атрибут таблицы присоединения не может быть пустым");
                    dispatch(setLoadingState(0));
                    return;
                }
                break;
            default:
                break;
        }



        // TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран
        if (props.mode === ViewMods.VIEW) {
            console.log('updating attr: ', attr);
            dispatch(updateAttribute(typeChanged, attr)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                setTypeChanged(false);
                navigate('/configure/attributes');
            });
        } else {
            console.log('creating attr: ', attr);
            dispatch(createAttribute(attr)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                setTypeChanged(false);
                navigate('/configure/attributes');
            });
        }

    }

    const handleBack = () => {
        navigate('/configure/attributes');
    }

    useEffect(() => {
        dispatch(setLoadingState(0));
    }, [dispatch]);

    useEffect(() => {
        if (confAttr && JSON.stringify(confAttr) !== JSON.stringify({})) {
            setAttr({ ...confAttr });
        } else {
            setAttr({ AttrName: "", AttrTypeId: 1, AttrTypeProp1: 100, AttrTypeProp2: null, TableId: confTable.TableId });
        }
    }, [confAttr, confTable.TableId]);


    useEffect(() => {
        setJoinTablesPool(allTables.filter(t => t.TableId !== confTable.TableId));
    }, [allTables, confTable.TableId]);

    useEffect(() => {
        setJoinAttrsPool(joinTablesPool.find(t => t.TableId === attr.AttrTypeProp1)?.Attributes);
    }, [joinTablesPool, attr.AttrTypeProp1]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                {props.mode === ViewMods.VIEW ? <h4 className='conf-header'>Изменение атрибута: {confAttr.AttrName}</h4> : <h4 className='conf-header'>Добавление атрибута</h4>}
                <div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Название атрибута:</div>
                        <div className='conf-edit-value'>
                            <input
                                type='text'
                                className='str-value-input'
                                value={attr.AttrName}
                                onChange={(e) => handleInputName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Тип атрибута:</div>
                        <div className='conf-edit-value'>
                            <DropdownButton id="dropdown-basic-button" variant='conf-dropdown' title={attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).AttrTypeName}>
                                {attrTypes.map((attrType, index) =>
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => typeChanged ? handleInputAttrType(attrType) : (window.confirm('Внимание! При изменении типа атрибута, данные в этом столбце будут потеряны. Продолжить?') ? handleInputAttrType(attrType) : null)}
                                        // onClick={() => handleInputAttrType(attrType)}
                                        active={attr.AttrTypeId === attrType.AttrTypeId}
                                    >{attrType.AttrTypeName}
                                    </Dropdown.Item>
                                )}
                            </DropdownButton>
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Описание типа:</div>
                        <div className='conf-edit-value'>
                            <div className='str-value-description'>
                                {attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).Comment}
                            </div>
                        </div>
                    </div>

                    <Switch expression={attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).SystemAttrTypeName}>
                        <Case value={"varchar"}>
                            <div className='conf-edit-block'>
                                <div className='conf-edit-name'>Максимальная длина строки:</div>
                                <div className='conf-edit-value'>
                                    <input
                                        type='text'
                                        className='str-value-input'
                                        value={attr.AttrTypeProp1}
                                        onChange={(e) => typeChanged ? handleInputProp1(e.target.value) : (window.confirm('Внимание! При изменении этого параметра, данные в этом столбце будут потеряны. Продолжить?') ? handleInputProp1(e.target.value) : null)}
                                    />
                                </div>
                            </div>
                        </Case>
                        <Case value={"decimal"}>
                            <div className='conf-edit-block'>
                                <div className='conf-edit-name'>Общее количество знаков:</div>
                                <div className='conf-edit-value'>
                                    <input
                                        type='text'
                                        className='str-value-input'
                                        value={attr.AttrTypeProp1}
                                        onChange={(e) => typeChanged ? handleInputProp1(e.target.value) : (window.confirm('Внимание! При изменении этого параметра, данные в этом столбце будут потеряны. Продолжить?') ? handleInputProp1(e.target.value) : null)}
                                    />
                                </div>
                            </div>
                            <div className='conf-edit-block'>
                                <div className='conf-edit-name'>Количество знаков после запятой:</div>
                                <div className='conf-edit-value'>
                                    <input
                                        type='text'
                                        className='str-value-input'
                                        value={attr.AttrTypeProp2}
                                        onChange={(e) => typeChanged ? handleInputProp2(e.target.value) : (window.confirm('Внимание! При изменении этого параметра, данные в этом столбце будут потеряны. Продолжить?') ? handleInputProp2(e.target.value) : null)}
                                    />
                                </div>
                            </div>
                        </Case>
                        <Case value={"join"}>
                            <div className='conf-edit-block'>
                                <div className='conf-edit-name'>Выберите таблицу:</div>
                                <div className='conf-edit-value'>
                                    <DropdownButton id="dropdown-basic-button" variant='conf-dropdown' title={joinTablesPool.find(table => table.TableId === attr.AttrTypeProp1)?.TableName ?? joinTablesPool[0].TableName}>
                                        {joinTablesPool.map((table, index) =>
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => typeChanged ? handleInputProp1(table.TableId) : (window.confirm('Внимание! При изменении этого параметра, данные в этом столбце будут потеряны. Продолжить?') ? handleInputProp1(table.TableId) : null)}
                                                active={attr.AttrTypeProp1 === table.TableId}
                                            >{table.TableName}
                                            </Dropdown.Item>
                                        )}
                                    </DropdownButton>
                                </div>
                            </div>
                            <div className='conf-edit-block'>
                                <div className='conf-edit-name'>Выберите атрибут:</div>
                                <div className='conf-edit-value'>
                                    <DropdownButton id="dropdown-basic-button" variant='conf-dropdown' title={joinAttrsPool?.find(a => a.AttrId === attr.AttrTypeProp2)?.AttrName ?? (joinAttrsPool?.length > 0 ? joinAttrsPool[0]?.AttrName : "undefined")}>
                                        {joinAttrsPool?.map((a, index) =>
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => typeChanged ? handleInputProp2(a.AttrId) : (window.confirm('Внимание! При изменении этого параметра, данные в этом столбце будут потеряны. Продолжить?') ? handleInputProp2(a.AttrId) : null)}
                                                active={attr.AttrTypeProp2 === a.AttrId}
                                            >{a.AttrName}
                                            </Dropdown.Item>
                                        )}
                                    </DropdownButton>
                                </div>
                            </div>
                        </Case>
                        <Case value="default">
                            <></>
                        </Case>
                    </Switch>

                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn save-conf-btn'
                        onClick={() => handleSave()}
                    >Сохранить</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к списку атриубтов</button>
                </div>
            </div>
        </div>
    );
};

export default ViewAttribute;
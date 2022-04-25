import { useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useRole from './hooks/useRole';
import { setLoadingState } from './redux/actions';
import { ViewMods } from './redux/enums';
import './styles/Configure.css';

function ViewRole({ mode }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const categories = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.categories;
    });

    const {
        role,
        setRole,
        saveChanges,
        saveNew,
        oldName,
        allAccessPoints
    } = useRole(mode === ViewMods.VIEW ? Number(params.roleId) : -1);



    const [toggleAccessCategories, setToggleAccessCateogories] = useState(false);
    const [toggleAccessPoints, setToggleAccessPoints] = useState(false);

    const newAccessCategory = (id, canEdit) => {
        return {
            Id: id,
            CanEdit: canEdit
        };
    };

    const handleInputName = (value) => {
        setRole({ ...role, RoleName: value });
    };

    const handleCheckedCategoryView = (checked, categoryId) => {
        if (checked) {
            setRole({ ...role, AccessCategories: [...role.AccessCategories, newAccessCategory(categoryId, false)] });
        } else {
            setRole({ ...role, AccessCategories: role.AccessCategories.filter(ac => ac.Id !== categoryId) });
        }
    }

    const handleCheckedCategoryEdit = (checked, categoryId) => {
        if (checked) {
            if (role.AccessCategories.some(ac => ac.Id === categoryId)) {
                setRole({ ...role, AccessCategories: role.AccessCategories.map(ac => ac.Id === categoryId ? newAccessCategory(categoryId, true) : ac) });
            } else {
                setRole({ ...role, AccessCategories: [...role.AccessCategories, newAccessCategory(categoryId, true)] });
            }
        } else {
            if (role.AccessCategories.some(ac => ac.Id === categoryId)) {
                setRole({ ...role, AccessCategories: role.AccessCategories.map(ac => ac.Id === categoryId ? newAccessCategory(categoryId, false) : ac) });
            } else {
                setRole({ ...role, AccessCategories: [...role.AccessCategories, newAccessCategory(categoryId, false)] });
            }
        }
    }

    const handleCheckedAccessPoint = (checked, accessPointId) => {
        if (checked) {
            setRole({ ...role, AccessPointIds: [...role.AccessPointIds, accessPointId] });
        } else {
            setRole({ ...role, AccessPointIds: role.AccessPointIds.filter(id => id !== accessPointId) });
        }
    }

    const handleSave = async () => {

        dispatch(setLoadingState(1));

        //TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран
        if (mode === ViewMods.VIEW) {
            // update role...
            console.log('updating role...');
            saveChanges().then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/roles');
            });
        } else {
            // create role...
            console.log('creating role...');
            saveNew().then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/roles');
            });
        }

    }

    const handleBack = () => {
        navigate('/roles');
    }

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                {mode === ViewMods.VIEW ? <h4 className='conf-header'>Редактирование роли: {oldName}</h4> : <h4 className='conf-header'>Создание роли</h4>}
                <div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Название роли:</div>
                        <div className='conf-edit-value'>
                            <input
                                type='text'
                                className='str-value-input'
                                value={role.RoleName}
                                onChange={(e) => handleInputName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='center-white margin-bot-10'>
                        <strong
                            className='md-size pointer'
                            onClick={() => setToggleAccessCateogories(!toggleAccessCategories)}
                        >
                            Доступные категории{toggleAccessCategories ? ' ▲' : ' ▼'}
                        </strong>
                    </div>
                    <Collapse in={toggleAccessCategories}>
                        <div>
                            <Table borderless responsive='sm' className='center-white'>
                                <thead>
                                    <tr>
                                        <th>Категория</th>
                                        <th>Просмотр</th>
                                        <th>Изменение данных</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) =>
                                        <tr key={category.CategoryId}>
                                            <td>
                                                <div>{category.CategoryName}</div>
                                            </td>
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    className='conf-checkbox-input'
                                                    checked={role.AccessCategories.some(ac => ac.Id === category.CategoryId)}
                                                    onChange={(e) => handleCheckedCategoryView(e.target.checked, category.CategoryId)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    className='conf-checkbox-input'
                                                    checked={role.AccessCategories.some(ac => ac.Id === category.CategoryId && ac.CanEdit === true)}
                                                    onChange={(e) => handleCheckedCategoryEdit(e.target.checked, category.CategoryId)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Collapse>

                    <div className='center-white margin-bot-10'>
                        <strong
                            className='md-size pointer'
                            onClick={() => setToggleAccessPoints(!toggleAccessPoints)}
                        >
                            Доступ к модулям настроек{toggleAccessPoints ? ' ▲' : ' ▼'}
                        </strong>
                    </div>
                    <Collapse in={toggleAccessPoints}>
                        <div>
                            <Table borderless responsive='sm' className='center-white'>
                                <thead>
                                    <tr>
                                        <th>Модуль</th>
                                        <th>Доступ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allAccessPoints.map((accessPoint) =>
                                        <tr key={accessPoint.AccessPointId}>
                                            <td>
                                                <div>{accessPoint.AccessPointName}</div>
                                            </td>
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    className='conf-checkbox-input'
                                                    checked={role.AccessPointIds.some(id => id === accessPoint.AccessPointId)}
                                                    onChange={(e) => handleCheckedAccessPoint(e.target.checked, accessPoint.AccessPointId)}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Collapse>

                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn save-conf-btn'
                        onClick={() => handleSave()}
                    >Сохранить</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к ролям</button>
                </div>
            </div>
        </div>
    );
};

export default ViewRole;
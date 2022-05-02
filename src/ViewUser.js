import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useUser from './hooks/useUser';
import { setLoadingState } from './redux/actions';
import { ViewMods } from './redux/enums';
import './styles/Configure.css';

function ViewUser({ mode }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const {
        user,
        setUser,
        saveChanges,
        saveNew,
        oldName,
        roles,
        resetPassword
    } = useUser(mode === ViewMods.VIEW ? Number(params.userId) : -1);

    const handleInputUsername = (value) => {
        setUser({ ...user, Username: value });
    };
    const handleInputRole = (value) => {
        setUser({ ...user, RoleId: value });
    }
    const copy = (text) => {
        navigator.clipboard.writeText(text);
    }

    const handleSave = async () => {

        dispatch(setLoadingState(1));

        //TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран
        if (mode === ViewMods.VIEW) {
            console.log('updating user...');
            saveChanges().then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/users');
            });
        } else {
            console.log('creating user...');
            saveNew().then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/users');
            });
        }

    }

    const handleBack = () => {
        navigate('/users');
    }

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                {mode === ViewMods.VIEW ? <h4 className='conf-header'>Редактирование пользователя: {oldName}</h4> : <h4 className='conf-header'>Создание пользователя</h4>}
                <div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Имя пользователя:</div>
                        <div className='conf-edit-value'>
                            <input
                                type='text'
                                className='str-value-input'
                                value={user.Username}
                                onChange={(e) => handleInputUsername(e.target.value)}
                                disabled={user.RoleId === 1}
                            />
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Роль:</div>
                        <div className='conf-edit-value'>
                            <DropdownButton
                                id="dropdown-basic-button"
                                variant='conf-dropdown'
                                title={roles.find(r => r.RoleId === user.RoleId)?.RoleName}
                                disabled={user.RoleId === 1}
                            >
                                {roles.map((role, index) =>
                                    role.RoleId !== 1 // RoleId = 1 - "Владелец", эту роль нельзя назначить
                                    &&
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => handleInputRole(role.RoleId)}
                                        active={user.RoleId === role.RoleId}
                                    >{role.RoleName}
                                    </Dropdown.Item>
                                )}
                            </DropdownButton>
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Пароль:</div>
                        <div className='conf-edit-value'>
                            <input
                                type='password'
                                className='str-value-input'
                                defaultValue={'***************'}
                                readOnly
                                disabled={user.RoleId === 1}
                            />
                            <button
                                className='conf-btn back-conf-btn'
                                onClick={() => copy(user.Password)}
                                disabled={!user.Password || user.RoleId === 1}
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    <div className='conf-edit-block'>
                        <button
                            className='conf-btn delete-conf-btn'
                            onClick={() => window.confirm('Вы уверены, что хотите сбросить пароль?') ? resetPassword() : null}
                            disabled={user.RoleId === 1}
                        >
                            Сбросить пароль
                        </button>
                    </div>

                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn save-conf-btn'
                        onClick={() => handleSave()}
                        disabled={!(user.Username && roles.find(r => r.RoleId === user.RoleId)) || user.RoleId === 1}
                    >Сохранить</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к пользователям</button>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;
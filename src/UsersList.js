import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers, setLoadingState, getRoles, deleteUser } from "./redux/actions";

function UsersList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const users = useSelector(state => {
        const { usersReducer } = state;
        return usersReducer.users;
    });

    const authUser = useSelector(state => {
        const { authReducer } = state;
        return authReducer.user;
    });

    const handleDelete = (user) => {
        dispatch(setLoadingState(1));
        console.log('deleting user: ', user);
        dispatch(deleteUser(user.UserId)).then((result) => {
            switch (result) {
                case 0: // success
                    dispatch(setLoadingState(0));
                    break;
                case 500: // internal server error
                    dispatch(setLoadingState(0));
                    window.alert("Произошла ошибка во время выполнения запроса на сервере!");
                    break;
                default: // other error
                    dispatch(setLoadingState(0));
                    window.alert("Произошла неизвестная ошибка!");
                    break;
            };
        });
    };

    const handleEdit = (user) => {
        navigate(`/users/edit_user/${user.UserId}`);
    };

    const handleAdd = () => {
        navigate('/users/add_user');
    };

    useEffect(() => {
        dispatch(setLoadingState(1));
        let loadState = 0;
        dispatch(getUsers()).then(() => {
            if (loadState === 1)
                dispatch(setLoadingState(0));
            else
                loadState++;
        });
        dispatch(getRoles()).then(() => {
            if (loadState === 1)
                dispatch(setLoadingState(0));
            else
                loadState++;
        });
    }, [dispatch]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                <h4 className='conf-header'>Пользователи</h4>
                <div>
                    {users.map(user =>
                        <div key={user.UserId} className='conf-block'>

                            <div className='conf-cat-name-block' >
                                <div className='conf-name-attr'>
                                    <div>{user.Username}</div>
                                </div>
                            </div>

                            <div className='conf-btn-block'>
                                <button
                                    className='conf-btn edit-conf-btn'
                                    onClick={() => handleEdit(user)}
                                    disabled={user.RoleId === 1 && !(authUser.RoleId === 1)} // RoleId === 1 - "Владелец"
                                >Редактировать</button>
                                <button
                                    className='conf-btn delete-conf-btn'
                                    onClick={() => window.confirm('Действительно хотите удалить этого пользователя?') ? handleDelete(user) : null}
                                    disabled={user.RoleId === 1} // RoleId === 1 - "Владелец"
                                >Удалить</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn add-conf-btn'
                        onClick={() => handleAdd()}
                    >Добавить пользователя</button>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteRole, getRoles, setLoadingState } from "./redux/actions";

function RolesList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const roles = useSelector(state => {
        const { rolesReducer } = state;
        return rolesReducer.roles;
    });

    const handleDelete = (role) => {
        dispatch(setLoadingState(1));
        console.log('deleting role: ', role);
        dispatch(deleteRole(role.RoleId)).then((result) => {
            switch (result) {
                case 0: // success
                    dispatch(setLoadingState(0));
                    break;
                case 409: // dependent users error
                    dispatch(setLoadingState(0));
                    window.alert("Чтобы удалить эту роль, сначала необходимо у пользователей с этой ролью изменить ее на другую");
                    break;
                case 500: // internal server error
                    dispatch(setLoadingState(0));
                    window.alert("Произошла ошибка во время выполнения запроса!");
                    break;
                default: // other error
                    dispatch(setLoadingState(0));
                    window.alert("Произошла неизвестная ошибка!");
                    break;
            };
        });
    };

    const handleEdit = (role) => {
        navigate(`/roles/edit_role/${role.RoleId}`);
    };

    const handleAdd = () => {
        navigate('/roles/add_role');
    };

    useEffect(() => {
        dispatch(setLoadingState(1));
        dispatch(getRoles()).then(() => {
            dispatch(setLoadingState(0));
        });
    }, [dispatch]);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                <h4 className='conf-header'>Роли</h4>
                <div>
                    {roles.map(role =>
                        <div key={role.RoleId} className='conf-block'>

                            <div className='conf-cat-name-block' >
                                <div className='conf-name-attr'>
                                    <div>{role.RoleName}</div>
                                </div>
                            </div>

                            <div className='conf-btn-block'>
                                <button
                                    className='conf-btn edit-conf-btn'
                                    onClick={() => handleEdit(role)}
                                    disabled={role.RoleId === 1} // RoleId === 1 - "Владелец"
                                >Редактировать</button>
                                <button
                                    className='conf-btn delete-conf-btn'
                                    onClick={() => handleDelete(role)}
                                    disabled={role.RoleId === 1} // RoleId === 1 - "Владелец"
                                >Удалить</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn add-conf-btn'
                        onClick={() => handleAdd()}
                    >Добавить роль</button>
                </div>
            </div>
        </div>
    );
};

export default RolesList;
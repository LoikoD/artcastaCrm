import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { selectSettingsMenu } from './redux/actions';
import { SettingsMenu } from './redux/enums';
import LoadingOverlay from './LoadingOverlay';
import './styles/Navigation.css';
import './styles/Settings.css';
import RequireRoles from './RequireRoles';
import { useEffect } from 'react';

function Settings() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const selectedMenu = useSelector(state => {
        const { settingsReducer } = state;
        return settingsReducer.selectedMenu;
    });

    const isLoading = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.isLoading;
    });

    const accessPoints = useSelector(state => {
        const { authReducer } = state;
        return authReducer.user.AccessPoints;
    })

    const handleSelectSection = (selection) => {
        switch (selection) {
            case SettingsMenu.CONF:
                navigate('/configure');
                break;
            case SettingsMenu.USERS:
                navigate('/users');
                break;
            case SettingsMenu.ROLES:
                navigate('/roles');
                break;
            default:
                // cannot be reached
                navigate('/');
        }
    };

    useEffect(() => {
        switch (location.pathname) {
            case '/configure':
                dispatch(selectSettingsMenu(SettingsMenu.CONF));
                break;
            case '/users':
                dispatch(selectSettingsMenu(SettingsMenu.USERS));
                break;
            case '/roles':
                dispatch(selectSettingsMenu(SettingsMenu.ROLES));
                break;
            default:
                break;
        }
    }, [dispatch, location]);

    return (
        <RequireRoles access_points={[SettingsMenu.CONF, SettingsMenu.USERS, SettingsMenu.ROLES]}>
            <div className='settings-page'>
                <LoadingOverlay show={isLoading} />
                <div>

                    {accessPoints.includes(SettingsMenu.CONF) ?
                        <button className={selectedMenu === SettingsMenu.CONF ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.CONF)}>
                            {SettingsMenu.CONF}
                        </button>
                        : <></>
                    }
                    {accessPoints.includes(SettingsMenu.USERS) ?
                        <button className={selectedMenu === SettingsMenu.USERS ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.USERS)}>
                            {SettingsMenu.USERS}
                        </button>
                        : <></>
                    }
                    {accessPoints.includes(SettingsMenu.ROLES) ?
                        <button className={selectedMenu === SettingsMenu.ROLES ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.ROLES)}>
                            {SettingsMenu.ROLES}
                        </button>
                        : <></>
                    }
                </div>
                <Outlet />

            </div>
        </RequireRoles>
    );
};

export default Settings;
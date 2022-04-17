import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectSettingsMenu } from './redux/actions';
import { AccessPoints, SettingsMenu } from './redux/enums';
import LoadingOverlay from './LoadingOverlay';
import './styles/Navigation.css';
import './styles/Settings.css';
import RequireRoles from './RequireRoles';

function Settings() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        dispatch(selectSettingsMenu(selection))
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

    return (
        <RequireRoles access_point={AccessPoints.SETTINGS}>
            <div className='settings-page'>
                <LoadingOverlay show={isLoading} />
                <div>

                    {accessPoints.includes(AccessPoints.CONFIGURE) ?
                        <button className={selectedMenu === SettingsMenu.CONF ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.CONF)}>
                            {SettingsMenu.CONF}
                        </button>
                        : <></>
                    }
                    {accessPoints.includes(AccessPoints.USERS) ?
                        <button className={selectedMenu === SettingsMenu.USERS ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.USERS)}>
                            {SettingsMenu.USERS}
                        </button>
                        : <></>
                    }
                    {accessPoints.includes(AccessPoints.ROLES) ?
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
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectSettingsMenu } from './redux/actions';
import { SettingsMenu } from './redux/enums';
import LoadingOverlay from './LoadingOverlay';
import './styles/Navigation.css';
import './styles/Settings.css';
import { useEffect } from 'react';

function Settings() {  

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedMenu = useSelector(state => {
        const {settingsReducer} = state;
        return settingsReducer.selectedMenu;
    });

    const isLoading = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.isLoading;
    });

    const handleSelectSection = (selection) => {
        dispatch(selectSettingsMenu(selection))
        switch(selection) {
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
        <div className='settings-page'>
            <LoadingOverlay show={isLoading} />
            <div>

                <button  className={selectedMenu === SettingsMenu.CONF ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.CONF)}>
                    {SettingsMenu.CONF}
                </button>
                <button className={selectedMenu === SettingsMenu.USERS ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.USERS)}>
                    {SettingsMenu.USERS}
                </button>
                <button className={selectedMenu === SettingsMenu.ROLES ? 'settings-tabs active-settings-tabs' : 'settings-tabs'} onClick={() => handleSelectSection(SettingsMenu.ROLES)}>
                    {SettingsMenu.ROLES}
                </button>
            </div>
            <Outlet />

        </div>
    );
};

export default Settings;
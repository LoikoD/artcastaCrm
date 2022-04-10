import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectSettingsMenu } from './redux/actions';
import { SettingsMenu } from './redux/enums';
import './styles/Navigation.css';

function Settings() {  

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedMenu = useSelector(state => {
        const {settingsReducer} = state;
        return settingsReducer.selectedMenu;
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
        }
    };

    return (

        <div >

            <button  className={selectedMenu === SettingsMenu.CONF ? 'table-tabs active-table-tabs' : 'table-tabs'} onClick={() => handleSelectSection(SettingsMenu.CONF)}>
                {SettingsMenu.CONF}
            </button>
            <button className={selectedMenu === SettingsMenu.USERS ? 'table-tabs active-table-tabs' : 'table-tabs'} onClick={() => handleSelectSection(SettingsMenu.USERS)}>
                {SettingsMenu.USERS}
            </button>
            <button className={selectedMenu === SettingsMenu.ROLES ? 'table-tabs active-table-tabs' : 'table-tabs'} onClick={() => handleSelectSection(SettingsMenu.ROLES)}>
                {SettingsMenu.ROLES}
            </button>
            <Outlet />

        </div>
    );
};

export default Settings;
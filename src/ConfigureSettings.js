import { Outlet } from 'react-router-dom';
import { SettingsMenu } from './redux/enums';
import RequireRoles from './RequireRoles';

function ConfigureSettings() {
    return (
        <RequireRoles access_points={SettingsMenu.CONF}>
            <Outlet />
        </RequireRoles>
    );
};

export default ConfigureSettings;
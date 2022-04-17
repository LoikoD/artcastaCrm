import { Outlet } from 'react-router-dom';
import { AccessPoints } from './redux/enums';
import RequireRoles from './RequireRoles';

function ConfigureSettings() {
    return (
        <RequireRoles access_point={AccessPoints.CONFIGURE}>
            <Outlet />
        </RequireRoles>
    );
};

export default ConfigureSettings;
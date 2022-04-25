import { Outlet } from "react-router-dom";
import { SettingsMenu } from "./redux/enums";
import RequireRoles from "./RequireRoles";

function RolesSettings() {

    return (
        <RequireRoles access_points={SettingsMenu.ROLES}>
            <Outlet />
        </RequireRoles>
    );
};

export default RolesSettings;
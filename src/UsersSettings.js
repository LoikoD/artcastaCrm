import { Outlet } from "react-router-dom";
import { SettingsMenu } from "./redux/enums";
import RequireRoles from "./RequireRoles";

function UsersSettings() {


    return (
        <RequireRoles access_points={SettingsMenu.USERS}>
            <Outlet />
        </RequireRoles>
    );
};

export default UsersSettings;
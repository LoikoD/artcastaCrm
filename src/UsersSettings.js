import { SettingsMenu } from "./redux/enums";
import RequireRoles from "./RequireRoles";

function UsersSettings() {


    return (
        <RequireRoles access_points={SettingsMenu.USERS}>
            <div>
                <h5>UsersSettings</h5>
            </div>
        </RequireRoles>
    );
};

export default UsersSettings;
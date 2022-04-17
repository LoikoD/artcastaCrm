import { AccessPoints } from "./redux/enums";
import RequireRoles from "./RequireRoles";

function RolesSettings() {  


    return (
        <RequireRoles access_point={AccessPoints.USERS}>
            <div>
            <h5>RolesSettings</h5>
            </div>
        </RequireRoles>
    );
};

export default RolesSettings;
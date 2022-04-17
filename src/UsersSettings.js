import { AccessPoints } from "./redux/enums";
import RequireRoles from "./RequireRoles";

function UsersSettings() {


    return (
        <RequireRoles access_point={AccessPoints.USERS}>
            <div>
                <h5>UsersSettings</h5>
            </div>
        </RequireRoles>
    );
};

export default UsersSettings;
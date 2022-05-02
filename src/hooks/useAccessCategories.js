import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAccessCategories = () => {
    
    const user = useSelector(state => {
        const {authReducer} = state;
        return authReducer.user
    });

    const roles = useSelector(state => {
        const {rolesReducer} = state;
        return rolesReducer.roles
    });

    const accessCategories = useMemo(() => {
        return roles.find(r => r.RoleId === user.RoleId)?.AccessCategories
    }, [roles, user]);

    return accessCategories;

}

export default useAccessCategories;
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux"
import { axiosPrivate } from "../api/axios";

const useRole = (roleId) => {

    const roles = useSelector(state => {
        const { rolesReducer } = state;
        return rolesReducer.roles;
    });

    const generateNewRole = () => {
        return {
            RoleName: "",
            AccessCategories: [],
            AccessTableIds: [],
            AccessPointIds: []
        };
    }

    const oldName = useMemo(() => {
        const oldRole = roles.find(r => r.RoleId === roleId);
        return oldRole ? oldRole.RoleName : "";
    }, [roleId, roles]);


    
    const [allAccessPoints, setAllAccessPoints] = useState([]);

    const getAllAccessPoints = async () => {
        try {
            const { data } = await axiosPrivate.get(`AccessPoints`);

            setAllAccessPoints(data);
        } catch (error) {
            console.log("updateAttribute > error: ", error);
            if (error?.response)
                console.log("updateAttribute > error.response: ", error.response);
            setAllAccessPoints([]);
        }
    };

    const findRoleById = (Id) => {
        const foundRole = roles.find(r => r.RoleId === Id);
        return foundRole ? foundRole : generateNewRole();
    }

    const [role, setRole] = useState(findRoleById(roleId));

    const saveChanges = async () => {
        try {
            await axiosPrivate.put(`roles/${role.RoleId}`, role);
            return 1;
        } catch (error) {
            console.log("saveChanges > error: ", error);
            if (error?.response)
                console.log("saveChanges > error.response: ", error.response);
            return 0;
        }
    }

    const saveNew = async () => {
        try {
            await axiosPrivate.post(`roles`, role);
            return 1;
        } catch (error) {
            console.log("saveNew > error: ", error);
            if (error?.response)
                console.log("saveNew > error.response: ", error.response);
            return 0;
        }
    }

    useEffect(() => {
        getAllAccessPoints();
    }, [])

    const returnObject = {
        role,
        setRole,
        saveChanges,
        saveNew,
        oldName,
        allAccessPoints
    };

    return returnObject;

}

export default useRole;
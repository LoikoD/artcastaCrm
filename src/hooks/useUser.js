import { useMemo, useState } from "react";
import { useSelector } from "react-redux"
import { axiosPrivate } from "../api/axios";
import generatePassword from "../components/generatePassword";

const useUser = (userId) => {

    const users = useSelector(state => {
        const { usersReducer } = state;
        return usersReducer.users;
    });

    const roles = useSelector(state => {
        const { rolesReducer } = state;
        return rolesReducer.roles;
    });

    const resetPassword = () => {
        const newPassword = generatePassword(12);
        setUser({...user, Password: newPassword});
        return newPassword;
    }

    const generateNewUser = () => {
        return {
            Username: "",
            RoleId: roles.at(-1).RoleId,
            Password: generatePassword(12)
        }
    }

    const oldName = useMemo(() => {
        const oldUser = users.find(u => u.UserId === userId);
        return oldUser ? oldUser.Username : "";
    }, [userId, users]);

    const findUserById = (Id) => {
        const foundUser = users.find(u => u.UserId === Id);
        return foundUser ? foundUser : generateNewUser();
    }

    const [user, setUser] = useState(findUserById(userId));

    const saveChanges = async () => {
        try {
            await axiosPrivate.put(`user/${user.UserId}`, user);
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
            await axiosPrivate.post(`user`, user);
            return 1;
        } catch (error) {
            console.log("saveNew > error: ", error);
            if (error?.response)
                console.log("saveNew > error.response: ", error.response);
            return 0;
        }
    }

    const returnObject = {
        user,
        setUser,
        saveChanges,
        saveNew,
        oldName,
        roles,
        resetPassword
    };

    return returnObject;

}

export default useUser;
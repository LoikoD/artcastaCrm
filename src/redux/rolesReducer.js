import { SET_EDITED_ROLE, SET_ROLES } from './types'

const initialState = {
    roles: [],
    editedRole: {}
}

export const rolesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROLES:
            return {
                ...state,
                roles: action.roles
            }
        case SET_EDITED_ROLE:
            return {
                ...state,
                editedRole: action.role
            }
        default:
            return state;
    }
}
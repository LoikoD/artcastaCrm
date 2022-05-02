import { SET_ROLES } from './types'

const initialState = {
    roles: []
}

export const rolesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROLES:
            return {
                ...state,
                roles: action.roles
            }
        default:
            return state;
    }
}
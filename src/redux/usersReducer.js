import { SET_USERS } from './types'

const initialState = {
    users: []
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        default:
            return state;
    }
}
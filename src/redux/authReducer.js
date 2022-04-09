import { LOGIN, REFRESH } from './types'

const initialState = {
    user: {},
    loggedIn: 0,
    accessToken: "",
    firstLoad: 1
}

export const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user,
                loggedIn: action.loggedIn,
                accessToken: action.accessToken,
                firstLoad: action.firstLoad
            }
        case REFRESH:
            return {
                ...state,
                accessToken: action.accessToken,
                loggedIn: action.accessToken ? 1 : 0
            }
        default:
            return state;
    }  
}
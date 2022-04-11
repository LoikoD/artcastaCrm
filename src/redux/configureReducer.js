import { OPEN_CONF_CATEGORY } from './types'

const initialState = {
    confCategory: {},
    confTable: {}
}

export const configureReducer = (state = initialState, action) => {
    switch(action.type) {
        case OPEN_CONF_CATEGORY:
            return {
                ...state,
                confCategory: action.category
            }
        default:
            return state;
    }  
}
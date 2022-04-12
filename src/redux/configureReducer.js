import { OPEN_CONF_CATEGORY, OPEN_CONF_TABLE } from './types'

const initialState = {
    confCategory: {},
    confTable: {}
}

export const configureReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CONF_CATEGORY:
            return {
                ...state,
                confCategory: action.category
            }
        case OPEN_CONF_TABLE:
            return {
                ...state,
                confTable: action.table
            }
        default:
            return state;
    }
}
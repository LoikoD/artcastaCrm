import { LOAD_ATTR_TYPES, OPEN_CONF_ATTR, OPEN_CONF_CATEGORY, OPEN_CONF_TABLE } from './types'

const initialState = {
    confCategory: {},
    confTable: {},
    confAttr: {},
    attrTypes: []
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
        case OPEN_CONF_ATTR:
            return {
                ...state,
                confAttr: action.attr
            }
        case LOAD_ATTR_TYPES:
            return {
                ...state,
                attrTypes: action.attrTypes
            }
        default:
            return state;
    }
}
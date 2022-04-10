import { SELECT_SETTINGS_MENU } from './types'
import { SettingsMenu } from './enums'

const initialState = {
    selectedMenu: SettingsMenu.CONF
}

export const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case SELECT_SETTINGS_MENU:
            return {
                ...state,
                selectedMenu: action.selectedMenu
            }
        default:
            return state;
    }  
}
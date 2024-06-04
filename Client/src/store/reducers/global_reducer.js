import * as ACTION_TYPES from '../actions/action_types'


export const initialState = {
    global_state: 0
}


export const GlobalReducer = (state, action) => {
    switch(action.type) {
      case ACTION_TYPES.SET_GLOBAL_STATE:
        return {
          ...state,
          global_state: action.payload
        }
      default:
        throw new Error();
    }
}
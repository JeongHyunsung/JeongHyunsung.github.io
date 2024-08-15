import { SET_GLOBAL_STATE } from '../actions/actionTypes';


const initialState = {
    globalState: 0
}


const GlobalReducer = (state = initialState, action) => {
    switch(action.type) {
      case SET_GLOBAL_STATE:
        return {
          ...state,
          globalState: action.payload
        }
      default:
        return state
    }
}

export default GlobalReducer
import { SET_USER_FETCHED, SET_USER_INFO } from '../actions/actionTypes';


const initialState = {
    isFetched: false,
    userInfo: {}
}


const AuthReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER_FETCHED:
            return {
                ...state,
                isFetched: action.payload
            }
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.payload
            }
      default:
        return state
    }
}

export default AuthReducer
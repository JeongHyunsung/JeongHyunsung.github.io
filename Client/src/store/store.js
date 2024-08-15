import {configureStore, combineReducers} from '@reduxjs/toolkit'
import GlobalReducer from './reducers/globalReducer'
import AuthReducer from './reducers/authReducer'


const rootReducer = combineReducers({
    global: GlobalReducer,
    auth: AuthReducer
});
  
const store = configureStore({
    reducer: rootReducer
});

export default store
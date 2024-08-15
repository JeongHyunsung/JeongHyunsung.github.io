import React, {useReducer} from 'react'

import AuthState from './auth_state_config'

import {Provider} from 'react-redux'
import store from './store/store'


function ContextState(props){

  return(
    <Provider store={store}>
      <AuthState/>
    </Provider>
  )
}

export default ContextState
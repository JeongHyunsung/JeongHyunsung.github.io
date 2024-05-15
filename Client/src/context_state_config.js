import React, {useReducer} from 'react'
import Context from './utils/context'
import * as ACTIONS from './store/actions/actions'

import * as AuthReducer from './store/reducers/auth_reducer'
import * as FormReducer from './store/reducers/form_reducer'
import * as PostsReducer from './store/reducers/posts_reducer'

import Routes from './routes'

import Auth from './utils/auth'

const auth = new Auth()

function ContextState(props){
  const [stateAuthReducer, dispatchAuthReducer] = useReducer(AuthReducer.AuthReducer, AuthReducer.initialState)
  const [statePostsReducer, dispatchPostsReducer] = useReducer(PostsReducer.PostsReducer, PostsReducer.initialState)
  const [stateFormReducer, dispatchFormReducer] = useReducer(FormReducer.FormReducer, FormReducer.initialState)


  const handleLogin = () => {
    dispatchAuthReducer(ACTIONS.login_success())
  }
  
  const handleLogout = () => {
    dispatchAuthReducer(ACTIONS.login_failure())
  }
  
  const handleDBProfile = (profile) => {
    dispatchAuthReducer(ACTIONS.set_db_profile(profile))
  }
  
  const handleRemoveDBProfile = () => {
    dispatchAuthReducer(ACTIONS.remove_db_profile())
  }
  
  const handleAddProfile = (profile) => {
    dispatchAuthReducer(ACTIONS.add_profile(profile))
  }
  
  const handleRemoveProfile = () => {
    dispatchAuthReducer(ACTIONS.remove_profile())
  }


  const handleFormChange = (event) => {
    dispatchFormReducer(ACTIONS.user_input_change(event.target.value))
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    event.persist();
    dispatchFormReducer(ACTIONS.user_input_submit(event.target.useContext.value))
  }


  const handleSetPosts = (posts) => {
    dispatchPostsReducer(ACTIONS.set_db_posts(posts) )
  }

  const handleRemovePosts = () => {
    dispatchPostsReducer(ACTIONS.remove_db_posts() )
  }

  //Handle authentication from callback
  const handleAuthentication = (props) => {
    if(props.location.hash) {
      auth.handleAuth()
    }
  }

  return(
    <div>
      <Context.Provider 
        value={{
          authState: stateAuthReducer.is_authenticated,
          dbProfileState: stateAuthReducer.db_profile,
          profileState: stateAuthReducer.profile,

          useContextChangeState: stateFormReducer.user_textChange,
          useContextSubmitState: stateFormReducer.user_textSubmit,

          postsState: statePostsReducer.posts,
          
          authObj: auth,

          handleAddDBProfile: (profile) => handleDBProfile(profile),
          handleRemoveDBProfile: () => handleRemoveDBProfile(),
          handleUserAddProfile: (profile) => handleAddProfile(profile),
          handleUserRemoveProfile: () => handleRemoveProfile(),
          handleUserLogin: () => handleLogin(),
          handleUserLogout: () => handleLogout(),

          useContextSubmit: (event) => handleFormSubmit(event),
          useContextChange: (event) => handleFormChange(event),

          handleAddPosts: (posts) => handleSetPosts(posts),
          handleRemovePosts: () => handleRemovePosts(),

          handleAuth: (props) => handleAuthentication(props),
        }}>
        <Routes/>
      </Context.Provider>
    </div>
  )
}

export default ContextState;
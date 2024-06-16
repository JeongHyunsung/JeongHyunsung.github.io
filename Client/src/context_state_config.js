import React, {useReducer} from 'react'
import Context from './utils/context'
import * as ACTIONS from './store/actions/actions'

import * as FormReducer from './store/reducers/form_reducer'
import * as PostsReducer from './store/reducers/posts_reducer'
import * as GlobalReducer from './store/reducers/global_reducer'

import AuthState from './auth_state_config'


function ContextState(props){
  const [statePostsReducer, dispatchPostsReducer] = useReducer(PostsReducer.PostsReducer, PostsReducer.initialState)
  const [stateFormReducer, dispatchFormReducer] = useReducer(FormReducer.FormReducer, FormReducer.initialState)
  const [stateGlobalReducer, dispatchGlobalReducer] = useReducer(GlobalReducer.GlobalReducer, GlobalReducer.initialState)


  const handleFormChange = (event) => {
    dispatchFormReducer(ACTIONS.user_input_change(event.target.value))
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    event.persist();
    dispatchFormReducer(ACTIONS.user_input_submit(event.target.useContext.value))
  }


  const handleSetPosts = (posts) => {
    dispatchPostsReducer(ACTIONS.set_db_posts(posts))
  }

  const handleRemovePosts = () => {
    dispatchPostsReducer(ACTIONS.remove_db_posts())
  }


  const handleSetGlobalState = (gs) => {
    dispatchGlobalReducer(ACTIONS.set_global_state(gs))
  }

  return(
    <div>
      <Context.Provider 
        value={{
          useContextChangeState: stateFormReducer.user_textChange,
          useContextSubmitState: stateFormReducer.user_textSubmit,
          postsState: statePostsReducer.posts,
          env: stateGlobalReducer.global_state,
          useContextSubmit: (event) => handleFormSubmit(event),
          useContextChange: (event) => handleFormChange(event),
          handleAddPosts: (posts) => handleSetPosts(posts),
          handleRemovePosts: () => handleRemovePosts(),
          senv: (gs) => handleSetGlobalState(gs)
        }}>
        <AuthState/>
      </Context.Provider>
    </div>
  )
}

export default ContextState
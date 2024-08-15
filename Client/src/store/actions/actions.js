import { SET_GLOBAL_STATE, SET_USER_FETCHED, SET_USER_INFO } from './actionTypes';

export const setGlobalState = (state) => {
  return {
    type: SET_GLOBAL_STATE,
    payload: state
  }
}

export const setUserFetched = (isFetched)=>{
  return {
    type: SET_USER_FETCHED,
    payload: isFetched
  }
}

export const setUserInfo = (userInfo)=>{
  return {
    type: SET_USER_INFO,
    payload: userInfo
  }
}
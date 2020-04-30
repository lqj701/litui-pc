import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchUsersAct = createAction('FETCH_USERS');
export const fetchUserInfoAct = createAction('FETCH_USER_INFO');

export function fetchUsers(params = {}) {
  return {
    [CALL_API]: {
      act: fetchUsersAct,
      endpoint: `/api/wx/wxUser/getWxUsers`,
      params
    }
  };
}

export function getUserInfo() {
  return {
    [CALL_API]: {
      act: fetchUserInfoAct,
      endpoint: 'api/wx/bCard/getUserInfo',
      method: 'POST'
    }
  };
}

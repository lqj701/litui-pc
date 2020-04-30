import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const getUserListAct = createAction('GET_USER_LIST');
export const getActivityListAct = createAction('GET_ACTIVITY_LIST');
export const getActivityAct = createAction('GET_ACTIVITY');
export const saveActivityAct = createAction('SAVE_ACTIVITY');

export function getUserList(params = {}) {
  return {
    [CALL_API]: {
      act: getUserListAct,
      endpoint: `/api/activity/getUserList`,
      params
    }
  };
}

export function getActivityList(params = {}) {
  return {
    [CALL_API]: {
      act: getActivityListAct,
      endpoint: '/api/activity/getActivityList',
      params
    }
  };
}

export function getActivity(params = {}) {
  return {
    [CALL_API]: {
      act: getActivityAct,
      endpoint: '/api/activity/getActivity',
      params,
      method: 'POST'
    }
  };
}

export function saveActivity(params = {}) {
  return {
    [CALL_API]: {
      act: saveActivityAct,
      endpoint: '/api/activity/save',
      params,
      method: 'POST'
    }
  };
}


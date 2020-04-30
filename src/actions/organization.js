import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchAccountInfoAct = createAction('FETCH_ACCOUNT_INFO');

export function fetchAccountInfo(params = {}) {
  return {
    [CALL_API]: {
      act: fetchAccountInfoAct,
      endpoint: `/api/wx/account/getAccountInfo`,
      params,
    },
  };
}

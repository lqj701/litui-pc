import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const syncOrgAct = createAction('SYNC_ORG');
export const syncOrgProgressAct = createAction('SYNC_ORG_PROGRESS');

export function syncOrg(params = {}) {
  return {
    [CALL_API]: {
      act: syncOrgAct,
      endpoint: `/api/wx/apps/${AppConf.appId}/syncOrganization`,
      method: 'POST',
      params,
    },
  };
}

export function fetchSyncOrgProgress(params = {}) {
  return {
    [CALL_API]: {
      act: syncOrgProgressAct,
      endpoint: `/api/wx/apps/${AppConf.appId}/getSyncProgress`,
      params,
    },
  };
}

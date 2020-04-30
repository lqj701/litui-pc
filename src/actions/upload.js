import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchUploadInfoAct = createAction('FETCH_UPLOAD_INFO');

export function fetchUploadInfo() {
  return {
    [CALL_API]: {
      act: fetchUploadInfoAct,
      endpoint: `/api/pc/image/offer`
    }
  };
}

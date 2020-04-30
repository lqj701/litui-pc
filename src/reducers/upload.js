import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import { fetchUploadInfoAct } from '../actions/upload';

export const fetchUploadInfo = handleAction(
  fetchUploadInfoAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return action.payload.data;
    }

    return state;
  },
  null
);

export default combineReducers({
  fetchUploadInfo
});

import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import { fetchAccountInfoAct } from '../actions/organization';

const accountInfo = handleAction(fetchAccountInfoAct, (state, action) => {
  if (action.payload && action.payload.code === 0) {
    return action.payload.data;
  }

  return state;
}, null);

export default combineReducers({
  accountInfo,
});



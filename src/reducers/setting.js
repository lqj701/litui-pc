import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import { fetchShopConfigAct, fetchPayConfigAct } from '../actions/setting';

export const fetchShopConfig = handleAction(
  fetchShopConfigAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return action.payload.data;
    }

    return state;
  },
  null
);

export const fetchPayConfig = handleAction(
  fetchPayConfigAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return action.payload.data;
    }

    return state;
  },
  null
);

export default combineReducers({
  fetchShopConfig,
  fetchPayConfig
});

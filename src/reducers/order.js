import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import { fetchOrdersAct, fetchOrderDetailAct } from '../actions/order';

const initState = {
  isFetching: true,
  data: [],
  hasNext: 0,
  pageSize: null
};

export const fetchOrders = handleAction(
  fetchOrdersAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        hasNext: action.payload.data.hasNext,
        data: action.payload.data.orderList,
        pageSize: action.payload.data.total
      });
    }

    return state;
  },
  initState
);

export const fetchOrderDetail = handleAction(
  fetchOrderDetailAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data
      });
    }

    return state;
  },
  null
);

export default combineReducers({
  fetchOrders,
  fetchOrderDetail
});

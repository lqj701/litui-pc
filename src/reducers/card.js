import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import { fetchCardsAct } from '../actions/card';

const initState = {
  isFetching: true,
  data: [],
  hasNext: 0,
  pageSize: undefined
};

export const fetchCards = handleAction(
  fetchCardsAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        hasNext: action.payload.data.hasNext,
        data: action.payload.data.cardDtoList,
        pageSize: action.payload.data.count
      });
    }

    return state;
  },
  initState
);

export default combineReducers({
  fetchCards
});

import { handleActions } from 'redux-actions';
import { fetchUsersAct } from '../actions/user';

export default handleActions({
  [fetchUsersAct]: (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return action.payload.data;
    }

    return state;
  },
}, {});

import { handleActions } from 'redux-actions';
import * as userAct from '../actions/wx-moments';

const initState = {
  userList: [],
  activityList: [],
  currentActivity: {},
};

export default handleActions({
  [userAct.getActivityListAct]: (state=initState, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {activityList:action.payload.data});
    }

    return state;
  },
  [userAct.getActivityAct]: (state=initState, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {currentActivity:action.payload.data});
    }

    return state;
  },
  [userAct.getUserListAct]: (state=initState, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {userList:action.payload.data});
    }

    return state;
  },
  [userAct.saveActivityAct]: (state=initState, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, action.payload.data);
    }

    return state;
  },
}, {});

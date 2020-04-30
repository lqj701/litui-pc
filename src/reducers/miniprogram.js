import { handleActions } from 'redux-actions';
import pull from 'lodash/pull';
import {
  fetchAuthorizationAct,
  fetchAuthUrlAct,
  fetchInfoAct,
  bindExpAccAct,
  mpManagementInoAct,
  // auditStatusAct,
} from '../actions/miniprogram';

export default handleActions(
  {
    [fetchAuthorizationAct]: (state, action) => {
      if (action.payload) {
        let status;

        if (action.payload.code === 1001) {
          status = 'unauthorized';
        } else if (action.payload.code === 0 && action.payload.data.enable) {
          status = 'authorized';
        } else {
          status = 'cancelAuthorized';
        }

        return Object.assign({}, state, {
          authorization: Object.assign(action.payload.data || {}, { status }),
        });
      }

      return state;
    },
    [fetchAuthUrlAct]: (state, action) => {
      return action.payload
        ? Object.assign({}, state, { authUrl: action.payload.data })
        : state;
    },
    [fetchInfoAct]: (state, action) => {
      return action.payload
        ? Object.assign({}, state, { info: action.payload.data })
        : state;
    },
    [bindExpAccAct]: (state, action) => {
      if (action.payload && action.payload.code === 0) {
        const info = Object.assign({}, state.info);

        if (action.params.type === 1) {
          info.wechat.push(action.params.wechatId);
        } else if (action.params.type === 2) {
          pull(info.wechat, action.params.wechatId);
        }

        return Object.assign({}, state, { info });
      }

      return state;
    },
    [mpManagementInoAct]: (state, action) => {
      if (action.payload && action.payload.code === 0) {
        return Object.assign({}, state, { miniprogramInfo: action.payload });
      }
      return state;
    }
    // [auditStatusAct]: (state, action) => {
    //   if (action.payload) {
    //     let status;

    //     if (action.payload.code === 0 && action.payload.data.status === 0) {
    //       status = { code: 0, message: '审核成功', reason: action.payload.data.reason };
    //     } else if (action.payload.code === 1 && action.payload.data.status === 1) {
    //       status = { code: 1, message:'审核失败', reason: action.payload.data.reason };
    //     } else if (action.payload.code === 2 && action.payload.data.status === 2) {
    //       status = { code: 1, message:'审核中', reason: action.payload.data.reason} ;
    //     }

    //     return Object.assign({}, state, { authorization: Object.assign(action.payload.data || {}, { status }) });
    //   }

    //   return state;
    // },
  },
  { authorization: null, authUrl: null, info: null, auditStatus: null, miniprogramInfo: null, }
);

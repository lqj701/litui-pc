import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import {
  fetchCustomerAct,
  updateCustomerAct,
  fetchCustomerByLastime,
  getInformationsAct,
  getReportCountAct,
  getCustomerDetailAct,
  searchCustomerAct,
  getCustomersOrderByCreateTimeAct,
  getCustomerInformationsAct,
  getCustomersOrderByCreateTimeAscAct
} from '../actions/customer';

const initState = {
  isFetching: true,
  data: [],
  hasNext: 0,
  pageSize: null
};

export const fetchCustomer = handleActions(
  {
    [fetchCustomerAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const updateCustomer = handleActions(
  {
    [updateCustomerAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

//
export const getCustomersOrderByLastInfoTime = handleActions(
  {
    [fetchCustomerByLastime](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const getCustomersOrderByCreateTime = handleActions(
  {
    [getCustomersOrderByCreateTimeAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const getReportCount = handleActions(
  {
    [getReportCountAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const getCustomerRevisitLog = handleActions(
  {
    [getInformationsAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const getCustomerDetail = handleActions(
  {
    [getCustomerDetailAct](state, action) {
      if (action.payload) {
        return {
          ...action.payload.data,
          isFetching: false
        };
      }
      return state;
    }
  },
  {
    isFetching: true
  }
);

export const searchCustomer = handleActions(
  {
    [searchCustomerAct](state, action) {
      return action.payload ? action.payload : state;
    }
  },
  null
);

export const getCustomerInformations = handleActions(
  {
    [getCustomerInformationsAct](state, action) {
      if (action.payload) {
        return Object.assign(
          {},
          {
            isFetching: false,
            data: action.payload.data.informations,
            hasNext: action.payload.data.hasNext
          }
        );
      }

      return state;
    }
  },
  initState
);

// 2018.05.08 暂时没有使用
export const getCustomersByCreateTime = handleActions(
  {
    [fetchCustomerAct](state, action) {
      if (action.payload) {
        return Object.assign(
          {},
          {
            isFetching: false,
            list: action.payload.customerDtoList,
            hasNext: action.payload.hasNext
          }
        );
      }

      return state;
    }
  },
  {
    isFetching: true,
    list: [],
    hasNext: 0
  }
);

export const getCustomersOrderByCreateTimeAsc = handleActions(
  {
    [getCustomersOrderByCreateTimeAscAct](state, action) {
      if (action.payload) {
        return Object.assign(
          {},
          {
            isFetching: false,
            list: action.payload.customerDtoList,
            hasNext: action.payload.hasNext
          }
        );
      }

      return state;
    }
  },
  {
    isFetching: true,
    list: [],
    hasNext: 0
  }
);

export default combineReducers({
  revisitLog: getCustomerInformations,
  report: getReportCount,
  customer: getCustomerDetail,
  updateCustomer,
  searchCustomer
});

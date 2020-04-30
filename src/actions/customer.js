import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchCustomerAct = createAction('FETCH_CUSTOMER');
export const updateCustomerAct = createAction('UPDATA_CUSTOMER');
export const fetchCustomerByLastime = createAction(
  'FETCH_CUSTOMER_BY_LASTTIME'
);
export const getCustomersOrderByCreateTimeAct = createAction(
  'FETCH_CUSTOMER_BY_CREATE'
);

export const getReportCountAct = createAction('FETCH_CUSTOMER_REPORT_COUNT');
export const getInformationsAct = createAction('FETCH_INFROMATIONS');
export const getCustomerInformationsAct = createAction(
  'FETCH_CUSTOMER_INFROMATIONS'
);

export const getCustomerDetailAct = createAction('FETCH_CUSTOMER_DETAIL');
export const followCustomerAct = createAction('SEND_REVISIT');
export const searchCustomerAct = createAction('FETCH_CUSTOMER_SEARCH');
export const getCustomersOrderByCreateTimeAscAct = createAction(
  'FETCH_CUSTOMER_BY_CREATE_ASC'
);

// // 获取客户列表
// export function getCustomer() {
//   return {
//     [CALL_API]: {
//       act: fetchCustomer,
//       endpoint: 'customer',
//       dataKey: 'customer',
//     },
//   };
// }

// 更新客户资料
export function updateCustomer(params = {}) {
  return {
    [CALL_API]: {
      act: updateCustomerAct,
      endpoint: 'api/wx/customer/editCustomerInfo',
      method: 'POST',
      dataKey: 'code',
      params,
    },
  };
}

///////
// 获得按最后情报时间排序的客户列表
export function listCustomer(params = {}) {
  return {
    [CALL_API]: {
      act: fetchCustomerAct,
      endpoint: '/api/wx/customer/listCustomer',
      method: 'POST',
      params,
    },
  };
}

export function getCustomersOrderByLastInfoTime(params = {}) {
  return {
    [CALL_API]: {
      act: fetchCustomerAct,
      endpoint: 'api/wx/customer/getCustomersOrderByLastInfoTime',
      params,
    },
  };
}

// 创建时间排序
export function getCustomersOrderByCreateTime(params = {}) {
  return {
    [CALL_API]: {
      act: fetchCustomerAct,
      endpoint: 'api/wx/customer/getCustomersOrderByCreateTime',
      params,
    },
  };
}

// 获取客户信息
export function getCustomerInfo(params = {}) {
  return {
    [CALL_API]: {
      act: getCustomerDetailAct,
      endpoint: 'api/wx/customer/getCustomerInfo',
      params,
    },
  };
}

// 跟进客户
export function followCustomer(params = {}) {
  return {
    [CALL_API]: {
      act: followCustomerAct,
      endpoint: 'api/wx/customer/followCustomer',
      method: 'POST',
      params,
    },
  };
}

// 获取今日昨日的情报总数
export function getCount(params = {}) {
  return {
    [CALL_API]: {
      act: getReportCountAct,
      endpoint: 'api/wx/information/getCount',
      params,
    },
  };
}

// 获取情报列表
export function getInformations(params = {}) {
  return {
    [CALL_API]: {
      act: getInformationsAct,
      endpoint: 'api/wx/information/getInformations',
      params,
    },
  };
}

export function getCustomerInformations(params = {}) {
  return {
    [CALL_API]: {
      act: getCustomerInformationsAct,
      endpoint: 'api/wx/information/getCustemorInformations',
      params,
    },
  };
}

/**
 * 搜索客户列表
 * @param {bool} type 0: 普通用户, 1: 管理员
 * @param {object} params 包含关键字
 * @return {object}
 */
export function searchCustomer(type, params = {}) {
  const path = type !== '0' ? 'searchCustomerForAdmin' : 'searchCustomer';

  return {
    [CALL_API]: {
      act: searchCustomerAct,
      endpoint: `api/wx/customer/${path}`,
      method: 'POST',
      params,
    },
  };
}

export function getCustomersOrderByCreateTimeAsc(params = {}) {
  return {
    [CALL_API]: {
      act: getCustomersOrderByCreateTimeAscAct,
      endpoint: '/api/wx/redpacket/getCustomersOrderByCreateTimeAsc',
      params,
    },
  };
}

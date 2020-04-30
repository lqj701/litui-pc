import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchOrdersAct = createAction('FETCH_ORDERS');
export const updateOrderPriceAct = createAction('UPDaTE_ORDER_PRICE');
export const updateOrderDeliverAct = createAction('UPDaTE_ORDER_DELIVE');
export const updateOrderLogisticAct = createAction('UPDaTE_ORDER_LOGISTIC');
export const updateOrderCompleteAct = createAction('UPDaTE_ORDER_Complete');
export const fetchOrderDetailAct = createAction('FETCH_ORDER_DETAIL');

export function fetchOrders(params = {}) {
  return {
    [CALL_API]: {
      act: fetchOrdersAct,
      endpoint: `/api/ec/pc/getOrderList`,
      params
    }
  };
}

export function searchOrders(params = {}) {
  return {
    [CALL_API]: {
      act: fetchOrdersAct,
      endpoint: `/api/ec/pc/searchOrder`,
      method: 'POST',
      params
    }
  };
}

export function updateOrderPrice(params = {}) {
  return {
    [CALL_API]: {
      act: updateOrderPriceAct,
      endpoint: `/api/ec/pc/modifyPrice`,
      method: 'POST',
      params
    }
  };
}

export function updateOrderDeliver(params = {}) {
  return {
    [CALL_API]: {
      act: updateOrderDeliverAct,
      endpoint: `/api/ec/pc/deliver`,
      method: 'POST',
      params
    }
  };
}

// 已发货修改物流信息
export function updateOrderLogistic(params = {}) {
  return {
    [CALL_API]: {
      act: updateOrderLogisticAct,
      endpoint: `/api/ec/pc/modifyLogistic`,
      method: 'POST',
      params
    }
  };
}

export function updateOrderComplete(params = {}) {
  return {
    [CALL_API]: {
      act: updateOrderCompleteAct,
      endpoint: `/api/ec/pc/completeOrder`,
      params
    }
  };
}

export function fetchOrderDetail(orderNum) {
  return {
    [CALL_API]: {
      act: fetchOrderDetailAct,
      endpoint: `/api/ec/pc/getOrder`,
      params: { orderNum }
    }
  };
}

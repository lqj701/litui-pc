import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchShopConfigAct = createAction('FETCH_SHOP_CONFIG');
export const updateShopConfigAct = createAction('UPDATE_SHOP_CONFIG');
export const updatePayConfigAct = createAction('UPDATE_PAY_CONFIG');
export const fetchPayConfigAct = createAction('FETCH_PAY_CONFIG');

export function fetchShopConfig(params = {}) {
  return {
    [CALL_API]: {
      act: fetchShopConfigAct,
      endpoint: `/api/pc/ecShop/get`,
      params
    }
  };
}

export function updateShopConfig(params = {}) {
  return {
    [CALL_API]: {
      act: updateShopConfigAct,
      endpoint: `/api/pc/ecShop/alter`,
      method: 'POST',
      params
    }
  };
}

export function updatePayConfig(params = {}) {
  return {
    [CALL_API]: {
      act: updatePayConfigAct,
      endpoint: `/api/pay/addOrUpdatePayConfig`,
      method: 'POST',
      params
    }
  };
}
export function fetchPayConfig() {
  return {
    [CALL_API]: {
      act: fetchPayConfigAct,
      endpoint: `/api/pay/getPayConfig`
    }
  };
}

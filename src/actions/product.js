import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchProductsAct = createAction('FETCH_PRODUCTS');
export const addProductAct = createAction('ADD_PRODUCTS');
export const updateProductsAct = createAction('UPDATE_PRODUCTS');
export const deleteProductAct = createAction('DELETE_PRODUCTS');
export const saleProductAct = createAction('SALE_PRODUCTS');
export const searchProductsAct = createAction('SEARCH_PRODUCTS');
export const fetchProductAct = createAction('FETCH_PRODUCT');
export const checkUnfinishedOrderAct = createAction('CHECK_ORDER_FINISH');

// list
export function fetchProducts(params = {}) {
  return {
    [CALL_API]: {
      act: fetchProductsAct,
      endpoint: `/api/pc/ecProduct/list`,
      params
    }
  };
}

export function fetchProduct(id) {
  return {
    [CALL_API]: {
      act: fetchProductAct,
      endpoint: `/api/pc/ecProduct/get`,
      params: { id }
    }
  };
}

// add
export function addProduct(params = {}) {
  return {
    [CALL_API]: {
      act: addProductAct,
      endpoint: `/api/pc/ecProduct/save`,
      method: 'POST',
      params
    }
  };
}

// upate
export function updateProduct(params = {}) {
  return {
    [CALL_API]: {
      act: updateProductsAct,
      endpoint: `/api/pc/ecProduct/save`,
      method: 'POST',
      params
    }
  };
}

export function deleteProduct(params = {}) {
  return {
    [CALL_API]: {
      act: deleteProductAct,
      endpoint: `/api/pc/ecProduct/delete`,
      method: 'POST',
      params
    }
  };
}

export function deleteProductGood(params = {}) {
  return {
    [CALL_API]: {
      act: deleteProductAct,
      endpoint: `/api/pc/ecProduct/ecGoods/delete`,
      method: 'POST',
      params
    }
  };
}

// 上下架商品
export function saleProduct(params = {}) {
  return {
    [CALL_API]: {
      act: saleProductAct,
      endpoint: `/api/pc/ecProduct/sale`,
      method: 'POST',
      params
    }
  };
}

// search
export function searchProducts(params = {}) {
  return {
    [CALL_API]: {
      act: fetchProductsAct,
      endpoint: `/api/pc/ecProduct/search`,
      params
    }
  };
}

export function checkUnfinishedOrder(params = {}) {
  return {
    [CALL_API]: {
      act: checkUnfinishedOrderAct,
      endpoint: `/api/pc/ecProduct/checkUnfinishedOrder`,
      params
    }
  };
}

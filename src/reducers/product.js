import { combineReducers } from 'redux';
import { handleAction } from 'redux-actions';
import {
  fetchProductsAct,
  addProductsAct,
  updateProductsAct,
  saleProductsAct,
  searchProductsAct,
  fetchProductAct
} from '../actions/product';

const initState = {
  isFetching: true,
  data: [],
  hasNext: 0,
  pageSize: null
};

const fetchProducts = handleAction(
  fetchProductsAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        hasNext: action.payload.data.hasNext,
        data: action.payload.data.products,
        pageSize: action.payload.data.count
      });
    }

    return state;
  },
  initState
);

const searchProducts = handleAction(
  searchProductsAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        hasNext: action.payload.data.hasNext,
        data: action.payload.data.products,
        pageSize: action.payload.data.count
      });
    }

    return state;
  },
  initState
);

const fetchProduct = handleAction(
  fetchProductAct,
  (state, action) => {
    if (action.payload && action.payload.code === 0) {
      return Object.assign({}, state, {
        isFetching: false,
        data: action.payload.data.product
      });
    }

    return state;
  },
  null
);

export default combineReducers({
  fetchProducts,
  fetchProduct
});

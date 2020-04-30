import { combineReducers } from 'redux';
import users from './user';
import organization from './organization';
import miniprogram from './miniprogram';
import product from './product';
import upload from './upload';
import order from './order';
import setting from './setting';
import card from './card';
import chat from './chat';
import customer from './customer';
import wxMoments from './wx-moments';

export default combineReducers({
  users,
  organization,
  miniprogram,
  product,
  order,
  setting,
  upload,
  card,
  chat,
  customer,
  wxMoments,
  conf: (state = {}) => state
});

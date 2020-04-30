/* global AppConf */
import fetch from 'isomorphic-fetch';
import {CALL_API} from './api';
import assign from 'lodash/assign';

function toQueryString(obj) {
  const esc = encodeURIComponent;
  return Object.keys(obj).map(k => `${esc(k)}=${esc(obj[k])}`).join('&');
}

function getQueryString(name) {
  let link = window.location.href;
  let url = new URL(link);

  return url.searchParams.get(name);
}

/**
 *
 * @property {object} AppConf.api            - API 配置
 * @property {object} AppConf.api.domains    - 所有 API 的域名
 * @property {string} AppConf.api.pathPrefix - API 的路径前缀
 */
function initUrl(endpoint, params, domain) {
  const pathname = endpoint.split('/').map((str) => {
    if (str[0] === ':') {
      const fill = params[str.substr(1)];
      delete params[str.substr(1)];
      return fill;
    }

    return str;
  }).join('/');

  let host;

  if (domain) {
    if (/^http/.test(domain)) {
      host = domain;
    } else {
      host = AppConf.api.domains[domain];
    }
  } else {
    host = AppConf.api.domain;
  }

  if (pathname[0] === '/') {
    return `${host}${pathname}`;
  }

  return `${host}${AppConf.api.pathPrefix}${pathname}`;
}

/**
 *
 * @property {string} AppConf.api.userToken - API 请求时用户的 token
 */
function callApi(opts) {
  const {endpoint, domain} = opts;
  const params = assign({}, opts.params);
  const fetchInit = {
    headers: {
      Authorization: `Token userToken=${AppConf.api.userToken}`,
      // crm
      // debug
      // Authorization: `Token accessToken=${AppConf.api.accessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  const accessToken = AppConf.api.accessToken;
  if (accessToken && accessToken !=='') {
    fetchInit.headers.Authorization = `Token accessToken=${AppConf.api.accessToken}`;
  }


  let {method, body} = opts;
  let fullUrl = initUrl(endpoint, params, domain);

  if (!method) {
    method = 'GET';
  }

  if (method === 'GET' || body) {
    fullUrl += `?${toQueryString(params)}`;
  }

  if (method !== 'GET') {
    fetchInit.method = method;
    fetchInit.body = JSON.stringify(body || params);
  }

  return fetch(fullUrl, fetchInit).then((response) => {
    const type = response.headers.get('content-type');
    let dataPromise;

    if (type.indexOf('application/json') > -1) {
      dataPromise = response.json();
    } else if (type.indexOf('text/plain') > -1) {
      dataPromise = response.text().then(text => ({code: 0, data: text}));
    } else {
      dataPromise = Promise.resolve('nothing');
    }

    return dataPromise.then(data => {
      if (!response.ok) {
        return Promise.reject(data);
      }

      return assign({}, data);
    });
  });
}

export default () => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const {method, endpoint, act, params, body, domain} = callAPI;

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (typeof act !== 'function') {
    throw new Error('Specify an action of redux-actions.');
  }

  const actionExtendOpts = {};

  if (params) {
    actionExtendOpts.params = params;
  }

  if (body) {
    actionExtendOpts.body = params;
  }

  function actionWith(data) {
    return assign(act(data), actionExtendOpts);
  }

  next(actionWith());

  return callApi({method, endpoint, params, body, domain}).then(
    response => next(actionWith(response)),
    error => next(actionWith(error)),
  );
};

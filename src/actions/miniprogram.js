import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchAuthorizationAct = createAction('FETCH_IS_AUTHORIZATION');
export const fetchAuthUrlAct = createAction('FETCH_AUTH_URL');
export const fetchInfoAct = createAction('FETCH_INFO');
export const bindExpAccAct = createAction('BIND_EXP_ACC');
export const codeCommitAct = createAction('CODE_COMMIT');
export const auditTemplateAct = createAction('AUDIT_TEMPLATE');
export const getWxQrcodeAct = createAction('FETCH_WX_QRCODE');
export const auditStatusAct = createAction('FETCH_AUDIT_STATUS');
export const releaseStatusAct = createAction('FETTCH_RELEASE_STATUS');
export const mpManagementInoAct = createAction('MPMANAGEMENTINOACT');
export const pushVersionInfoAct = createAction('PUSHVERSIONINFO');
export const upgradeMustKnowSetAct = createAction('UPGRADEMUSTKNOWSETACT');
export const upgradeMustKnowGetAct = createAction('UPGRADEMUSTKNOWGETACT');

export function fetchAuthorization(params = {}) {
  return {
    [CALL_API]: {
      act: fetchAuthorizationAct,
      endpoint: '/auth/:orgId/isAuth',
      params
    }
  };
}

export function fetchAuthUrl(params = {}) {
  return {
    [CALL_API]: {
      act: fetchAuthUrlAct,
      endpoint: '/auth/:orgId/winCard/componentLoginPage',
      params
    }
  };
}

export function fetchInfo(params = {}) {
  return {
    [CALL_API]: {
      act: fetchInfoAct,
      endpoint: '/auth/:orgId/mpManagementIno',
      params
    }
  };
}

// deleted
export function bindExpAcc(params = {}) {
  return {
    [CALL_API]: {
      act: bindExpAccAct,
      endpoint: '/auth/:orgId/binding/',
      params
    }
  };
}

export function auditTemplate(params = {}) {
  return {
    [CALL_API]: {
      act: auditTemplateAct,
      endpoint: '/auth/:orgId/audit/template',
      method: 'POST',
      params
    }
  };
}

export function codeCommit(params = {}) {
  return {
    [CALL_API]: {
      act: codeCommitAct,
      endpoint: '/auth/:orgId/code/commit',
      method: 'POST',
      params
    }
  };
}

// 生成小程序二维码
export function getWxQrcode(params = {}) {
  return {
    [CALL_API]: {
      act: getWxQrcodeAct,
      endpoint: `/auth/:orgId/mp/qrcode`,
      params
    }
  };
}

export function auditStatus(params = {}) {
  return {
    [CALL_API]: {
      act: auditStatusAct,
      endpoint: `/auth/:orgId/auditStatus`,
      method: 'POST',
      params
    }
  };
}

export function releaseStatus() {
  return {
    [CALL_API]: {
      act: releaseStatusAct,
      endpoint: `/auth/${AppConf.orgId}/release`,
      method: 'POST'
    }
  };
}

export function mpManagementIno() {
  return {
    [CALL_API]: {
      act: mpManagementInoAct,
      endpoint: `/auth/${AppConf.orgId}/mpManagementIno`
    }
  };
}

// 没有用的
export function pushVersionInfo(params = {}) {
  return {
    [CALL_API]: {
      act: pushVersionInfoAct,
      endpoint: `/auth/${AppConf.orgId}/version`,
      params
    }
  };
}

export function upgradeMustKnowSet(params = {}) {
  return {
    [CALL_API]: {
      act: upgradeMustKnowSetAct,
      endpoint: `api/setting/upgradeMustKnowSet`,
      method: 'POST',
      params
    }
  };
}

export function upgradeMustKnowGet(params = {}) {
  return {
    [CALL_API]: {
      act: upgradeMustKnowGetAct,
      endpoint: `api/setting/upgradeMustKnowGet`,
      params
    }
  };
}

import React from 'react';
import {
  Link as RRLink,
  NavLink as RRNavLink,
  Redirect as RRRedirect,
} from 'react-router-dom';
import assign from 'lodash/assign';

function handleLinkProps(props) {
  const queryString = `corpId=${AppConf.corpId}&agentId=${AppConf.agentId}&userToken=${AppConf.api.userToken}`;
  const to = props.to.indexOf('?') > -1 ? `${props.to}&${queryString}` : `${props.to}?${queryString}`;
  return assign({}, props, { to });
}

export function Link(props) {
  return <RRLink {...props} />;
}

export function NavLink(props) {
  return <RRNavLink {...props}  />;
}

export function Redirect(props) {
  return <RRRedirect {...props}  />;
}

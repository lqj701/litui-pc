import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Redirect } from '../components/Router';
import { hot } from 'react-hot-loader';
import asyncComp from '../components/AsyncComp';
import Layout from '../components/layout';
import ChatLoading from '../containers/chat/ChatLoading';

const SettingsHome = asyncComp(() => import('../pages/settings/Home'));
const SettingsDepartmentAndUser = asyncComp(() => import('../pages/settings/DepartmentAndUser'));
// const SettingsMiniprogram = asyncComp(() => import('../pages/settings/Miniprogram'));
const SettingsMiniprogram = asyncComp(() => import('../pages/miniprogram'));
const NumberLimit = asyncComp(() => import('../pages/errors/NumberLimit'));
const Expired = asyncComp(() => import('../pages/errors/Expired'));
const Denied = asyncComp(() => import('../pages/errors/Denied'));

const ShoppingSetting = asyncComp(() => import('../pages/shopping/Setting'));
const ShoppingProduct = asyncComp(() => import('../pages/shopping/Product'));
const ShoppingProductAdd = asyncComp(() =>
  import('../pages/shopping/ProductAdd')
);
const ShoppingProductEditor = asyncComp(() =>
  import('../pages/shopping/ProductEditor')
);
const ShoppingOrder = asyncComp(() => import('../pages/shopping/Order'));
const ShoppingOrderDetail = asyncComp(() =>
  import('../pages/shopping/OrderDetail')
);
const CardsList = asyncComp(() => import('../pages/cards/List'));
const Implantation = asyncComp(() => import('../pages/implantation'));
const WxMomentsEdit = asyncComp(() => import('../pages/wx-moments/Edit'));
const WxMomentsList = asyncComp(() => import('../pages/wx-moments/List'));
const sso = asyncComp(() => import('../pages/test/sso'));

if (window.location.pathname === '/') {
  window.history.replaceState({}, '', `/wx/${AppConf.appId}/h5`);
}

const redirectToHome = () => <Redirect to={`/settings/home`} />;

const RestrictedRoute = ({ component: Component, auth, ...other }) => (
  <Route
    {...other}
    render={props =>
      auth ? <Component {...props} /> : <Redirect to="/errors/denied" />
    }
  />
);

function Router() {
  return (
    <BrowserRouter basename={`/wx/${AppConf.appId}/h5`}>
      <React.Fragment>
        <Switch>
          <Route exact path="(/|/home)" render={redirectToHome} />
          <Route exact path="/implantation/:id" component={ChatLoading} />
          <RestrictedRoute
            auth
            path="/implantation/:id/chat"
            component={Implantation}
          />
          <Route exact path="/errors/number-limit" component={NumberLimit} />
          <Route exact path="/errors/expired" component={Expired} />
          <Route exact path="/errors/denied" component={Denied} />

          {/* // 注销企业 */}
          {/* <Route exact path="/errors/destroy" component={Denied} /> */}

          <Layout>
            <Switch>
              <Route exact path="/settings/home" component={SettingsHome} />
              <Route
                exact
                path="/settings/department-and-user"
                component={SettingsDepartmentAndUser}
              />
              <Route
                exact
                path="/miniprogram"
                component={SettingsMiniprogram}
              />
              <Route
                exact
                path={"/wx-moments-edit"}
                component={WxMomentsEdit}
              />
              <Route
                exact
                path={"/wx-moments-edit/:id/:name"}
                component={WxMomentsEdit}
              />
              <Route
                exact
                path="/wx-moments-list"
                component={WxMomentsList}
              />

              <Route exact path="/cards/list" component={CardsList} />
              <Route
                exact
                path="/shopping/setting"
                component={ShoppingSetting}
              />
              <Route
                exact
                path="/shopping/setting/base"
                component={ShoppingSetting}
              />
              <Route
                exact
                path="/shopping/setting/pay"
                component={ShoppingSetting}
              />
              <Route
                exact
                path="/shopping/product"
                component={ShoppingProduct}
              />
              <Route
                exact
                path="/shopping/product/add"
                component={ShoppingProductAdd}
              />
              <Route
                exact
                path="/shopping/product/editor/:id"
                component={ShoppingProductEditor}
              />
              <Route exact path="/shopping/order" component={ShoppingOrder} />
              <Route
                exact
                path="/shopping/order/detail/:id"
                component={ShoppingOrderDetail}
              />
              <Route
                exact
                path="/test/sso"
                component={sso}
              />
            </Switch>
          </Layout>
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default hot(module)(Router);

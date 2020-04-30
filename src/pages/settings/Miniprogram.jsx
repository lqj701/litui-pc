import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAuthorization } from '../../actions/miniprogram';
import Spin from '../../components/feedback/Spin';
import Unbind from '../../containers/miniprogram/Unbind';
import Management from '../../containers/miniprogram/Management';
import BindResult from '../errors/BindResult';
import Notes from '../../containers/miniprogram/Notes';

class Miniprogram extends Component {
  state = {
    bindResult: false,
    bindCode: ''
  };
  componentDidMount() {
    this.props.fetchAuthorization({
      orgId: AppConf.orgId
    });

    const msg = this.getParam('msg');
    if (msg) {
      this.setState({ bindCode: msg, bindResult: true });
    }
  }

  getParam(name) {
    let result = null;
    const params = location.search.slice(1).split('&');
    params.forEach(value => {
      const param = value.split('=');
      const key = param[0];
      const val = param[1];

      if (name === key) {
        result = val;
      }
    });

    return result;
  }

  render() {
    const { authorization } = this.props;
    const { bindResult, bindCode } = this.state;
    let content = null;

    if (bindResult) {
      content = <BindResult code={bindCode} />;
    } else {
      if (!authorization) {
        content = <Spin />;
      } else if (authorization.status === 'authorized') {
        content = <Management />;
      } else {
        content = <Unbind />;
      }
    }

    return content;
  }
}

Miniprogram.propTypes = {
  fetchAuthorization: PropTypes.func.isRequired,
  authorization: PropTypes.object
};

function mapStateToProps(state) {
  return {
    authorization: state.miniprogram.authorization
  };
}

export default connect(
  mapStateToProps,
  { fetchAuthorization }
)(Miniprogram);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchAuthorization,
  upgradeMustKnowSet,
  upgradeMustKnowGet
} from '../../actions/miniprogram';
import Management from '../../containers/miniprogram/Management';
import BindMiniprogram from '../../containers/miniprogram/BindMiniprogram';
import Spin from '../../components/feedback/Spin';
import BindResult from '../errors/BindResult';
import Notes from '../../containers/miniprogram/Notes';

class Miniprogram extends Component {
  state = {
    bindResult: false,
    bindCode: ''
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAuthorization({
      orgId: AppConf.orgId
    });

    const msg = this.getParam('msg');
    if (msg) {
      this.setState({ bindCode: msg, bindResult: true });
    }

    // this.setState({ litui_pc_notes: 0 });
    this.props.upgradeMustKnowGet().then(action => {
      this.setState({
        litui_pc_notes: action.payload.data.haveReadedUpgradeMustKnow
      });
    });
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

  getNotesStatus() {
    return window.localStorage.getItem('litui_pc_notes');
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
        if (this.state.litui_pc_notes) {
          content = <BindMiniprogram />;
        } else {
          content = <Notes {...this.props} />;
        }
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
  { fetchAuthorization, upgradeMustKnowSet, upgradeMustKnowGet }
)(Miniprogram);

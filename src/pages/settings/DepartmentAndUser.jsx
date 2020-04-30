import React, { Component } from 'react';
import styled from 'styled-components';
import SettingsLayout from '../../components/layout/SettingsLayout';
import SyncOrg from '../../containers/department-and-user/SyncOrg';
import UserList from '../../containers/department-and-user/UserList';

const Wrapper = styled.div`
`;

class DepartmentAndUser extends Component {
  constructor(props) {
    super(props);
    this.bindUserListRef = this.bindUserListRef.bind(this);
    this.handleSyncOrgDone = this.handleSyncOrgDone.bind(this);
  }

  handleSyncOrgDone() {
    this.userList.fetchUsers();
  }

  bindUserListRef(ref) {
    if (!ref) return;
    this.userList = ref.getWrappedInstance();
  }

  render() {
    return (
      <Wrapper>
        <SyncOrg onSyncDone={this.handleSyncOrgDone} />
        <UserList ref={this.bindUserListRef} />
      </Wrapper>
    );
  }
}

export default DepartmentAndUser;

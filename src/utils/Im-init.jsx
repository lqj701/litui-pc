import React from 'react';
import styled from 'styled-components';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { getUserInfo } from '../actions/user';
import {
  fetchImAccount,
  createChatContacts,
  updateChatContacts,
  updateChatCommunication,
  fetchChatUserInfo,
  updateChatAllUnread,
  increaseChatAllUnread,
  fetchUnreadNum
} from '../actions/chat';
import imsdk from './imsdk';
import webim from './imsdk/webim';

const UnradBage = styled.span`
  display: inline-block;
  padding: 0.15em 0.4em;
  min-width: 18px;
  border-radius: 18px;
  background-color: #e64340;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  font-size: 12px;
  vertical-align: middle;
  position: fixed;
  bottom: 0.6rem;
  left: 3rem;
  z-index: 11;
`;

class ImInit {
  constructor({ store }) {
    this.store = store;
    this.init();
  }

  init() {
    this.registerUpdateAllRead();
    this.getWxUser().then(() => {
     
      this.getImAccount().then(() => {
        this.login().then(() => {
          this.getContactList().then(({ contacts, customerList }) => {
            // 查找所有联系人的账号，获取的未读数
            
            const accountIds = customerList ? customerList.map(account => account.account_id): [];
            this.store
              .dispatch(
                fetchUnreadNum({
                  toAccountId: this.imAccount.account_id,
                  fromAccountIds: accountIds
                })
              )
              .then(() => this.syncMsgs(contacts, customerList));
          });
        }).catch(err=> console.log(err));
      }).catch(err=> console.log(err));
    }).catch(err=> console.log(err));
  }

  syncMsgs(contacts, customerList) {
    const list = [];
    let allUnread = 0;
    
    webim.syncMsgs(() => {
      const state = this.store.getState();
      // 联系人的未读数
      const unreadMap = state.chat.unreadNum;
      const sessMap = this.toUnreadObject(unreadMap);

      contacts.forEach(o => {
        const customer = find(customerList, { account_id: o.toAccount });
        if (!customer) return;

        const sess = sessMap[o.toAccount];
        const unread = sess ? sess : 0;
        // 记录总未读数
        allUnread += unread;

        list.push(
          Object.assign(o, {
            toAccountAvatar: customer.face_url,
            toAccountNick: customer.remark,
            unread
          })
        );
      });

      this.store.dispatch(createChatContacts(list));
      this.store.dispatch(updateChatAllUnread(allUnread));
    });
  }

  getContactList() {
    return imsdk.getRecentContactList().then(contacts => {
      if (!contacts) Promise.reject(false);

      return this.store
        .dispatch(
          fetchChatUserInfo({
            userId: this.wxUser.id,
            customerImAccountId: contacts.map(o => o.toAccount)
          })
        )
        .then(act => {
          // console.error(1,contacts, act.payload.data)
          return { contacts, customerList: act.payload.data };
        });
    });
  }

  login() {
    return imsdk.login({
      loginInfo: this.loginInfo(),
      listeners: this.loginListeners()
    });
  }

  getImAccount() {
    return this.store
      .dispatch(
        fetchImAccount({ orgId: AppConf.orgId, userIdOrOpenid: this.wxUser.id })
      )
      .then(act => {
        this.imAccount = act.payload.data.imAccount;
      });
  }

  getWxUser() {
    return this.store.dispatch(getUserInfo()).then(act => {
      this.wxUser = act.payload.data.wxUser;
    });
  }

  registerUpdateAllRead() {
    window.updateAllRead = () => {
      const state = this.store.getState();

      if (state.chat.allUnread > 0) {
        let count = state.chat.allUnread;
        if (count > 99) {
          count = '99+';
        }

        return <UnradBage>{count}</UnradBage>;
      } else {
        return <span />;
      }
    };

    this.store.subscribe(window.updateAllRead);
  }

  loginInfo() {
    return {
      identifier: this.imAccount.account_id,
      identifierNick: this.imAccount.nike_name,
      userSig: this.imAccount.sign_password
    };
  }

  loginListeners() {
    return {
      onMsgNotify: list => {
        const contacts = this.store.getState().chat.contacts;
        const newContacts = this.selectNewContacts(list, contacts);

        this.getChatUserInfo(newContacts).then(resp => {
          list.forEach(item => {
            const contact = this.buildContact(item, resp);
            // 更新最新消息到 contact
            this.store.dispatch(updateChatContacts(contact));
            // 更新总未读数
            this.store.dispatch(increaseChatAllUnread());
            // 添加最新消息到会话页面
            this.appendMsgToCommunication(item);
          });
        });
      }
    };
  }

  selectNewContacts(msgList, contacts) {
    return filter(msgList, o => {
      const isMatched =
        contacts.map(s => s.toAccount).indexOf(o.fromAccount) < 0;

      if (isMatched) {
        o.isNew = true;
      }

      return isMatched;
    });
  }

  getChatUserInfo(newContacts) {
    if (newContacts.length) {
      return this.store.dispatch(
        fetchChatUserInfo({
          userId: this.wxUser.id,
          customerImAccountId: newContacts.map(o => o.fromAccount)
        })
      );
    }

    return Promise.resolve(null);
  }

  buildContact(msgItem, usersInfo) {
    const contact = {
      toAccount: msgItem.fromAccount,
      lastMsg: msgItem.elems[0].content.text,
      lastMsgTime: msgItem.time * 1000
    };

    if (msgItem.isNew) {
      const customerInfo = find(usersInfo.payload, {
        accountId: msgItem.fromAccount
      });
      contact.toAccountAvatar = customerInfo.faceUrl;
      contact.toAccountNick = customerInfo.remark;
    }

    return contact;
  }

  // 添加最新消息到会话页面
  appendMsgToCommunication(msgItem) {
    const currentContact = find(this.store.getState().chat.contacts, {
      toAccount: msgItem.fromAccount
    });

    this.store.dispatch(
      updateChatCommunication({
        id: msgItem.fromAccount,
        msg: {
          dataSource: 'history',
          random: msgItem.random,
          name: currentContact.toAccountNick,
          avator: currentContact.toAccountAvatar,
          message: msgItem.elems[0].content.text,
          lastTime: msgItem.time * 1000,
          direction: 'left',
          wx_user_id: this.imAccount.accountId,
          customer_id: msgItem.fromAccount.split('_')[1]
        }
      })
    );
  }

  toUnreadObject(array) {
    if (Object.prototype.toString.call(array) !== '[object Array]')
      return array;

    let obj = {};
    array.forEach(element => {
      const key = element.fromAccountId;
      const value = element.unreadCount;
      obj[key] = value;
    });

    return obj;
  }
}

export default ImInit;

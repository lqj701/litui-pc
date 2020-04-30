import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'antd';
import fetch from 'isomorphic-fetch';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const Wrapper = styled.div`
  > img {
    max-width: 100%;
    max-height: 600px;
  }
`;

export default class Crop extends Component {
  static propTypes = {
    onCancel: PropTypes.any,
    onFinish: PropTypes.any,
    token: PropTypes.any,
    host: PropTypes.any,
    action: PropTypes.any,
    src: PropTypes.any
  };
  static defaultProps = {};

  cropper = null;

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      isLoading: false
    };
  }

  handleOk = () => {
    this.cut(() => {
      this.setState({
        visible: false,
        isLoading: false
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });

    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  componentDidMount() {
    setTimeout(() => {
      this.initCropper();
    });
  }

  /**
   * 根据base64 内容 取得 bolb
   *
   * @param {string} dataurl
   * @param {string} type
   * @returns Blob
   */
  dataURLtoBlob(dataurl, type) {
    const arr = dataurl.split(',');
    const bstr = window.atob(arr[1]);
    const mime = arr[0].match(/:(.*?);/)[1];
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: type ? type : mime });
  }

  initCropper() {
    this.cropper = new Cropper(this.dragImg, {
      viewMode: 1, // 限制裁剪框不超过画布的大小
      dragMode: 'move', // 拖动模式
      aspectRatio: 1 / 1, // 裁剪框比例
      autoCropArea: 0.8, // 默认值0.8（图片的80%）。0-1之间的数值，定义自动剪裁框的大小
      restore: false, // 是否调整窗口大小后恢复裁剪区域
      guides: true, // 是否在剪裁框上显示虚线
      center: true, // 是否显示裁剪框 中间的+
      highlight: true, // 是否在剪裁框上显示白色的模态窗口
      cropBoxMovable: false, // 是否允许拖动裁剪框
      cropBoxResizable: false, // 是否允许拖动 改变裁剪框大小
      toggleDragModeOnDblclick: false // 是否允许 拖动模式 “crop” 跟“move” 的切换状态, 即当点下为crop 模式，如果未松开拖动这时就是“move”模式。放开后又为“crop”模式
    });
  }

  cut(onSuccess) {
    const cropper = this.cropper;
    const cropData = cropper.cropBoxData;
    const canvas = cropper.getCroppedCanvas({
      // width: cropData.width,
      // height: cropData.height,
      width: 690,
      height: 690
    });

    this.setState({ isLoading: true });
    // const dataUrl = canvas.toDataURL();
    // const $Blob = this.dataURLtoBlob(dataUrl, 'image/jpeg');

    let formData = new FormData();
    formData.append('token', this.props.token);

    canvas.toBlob(blob => {
      formData.append('file', blob, `file_${Date.parse(new Date())}.jpeg`);

      this.ajax(formData).then(response => {
        onSuccess && onSuccess();

        const url = `${this.props.host}/${response.hash}`;
        const { onFinish } = this.props;
        if (onFinish) {
          onFinish(response.hash, url);
        }
      });
    });
  }

  ajax(body) {
    const { action } = this.props;

    return fetch(action, { method: 'POST', body }).then(response =>
      response.json()
    );
  }

  render() {
    const { src } = this.props;

    return (
      <Modal
        title="图片裁剪"
        width="800px"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={this.state.isLoading}
        okText="裁剪"
      >
        <Wrapper>
          <img ref={el => (this.dragImg = el)} src={src} />
        </Wrapper>
      </Modal>
    );
  }
}
//

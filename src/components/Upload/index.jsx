import { Icon, message, Upload } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import Crop from './Cropper';

const Wrapper = styled.div`
  ${({ small }) =>
    small &&
    css`
      .ant-upload-select-picture-card {
        width: 56px;
        height: 56px;
      }

      .ant-upload-list-picture-card .ant-upload-list-item {
        width: 56px;
        height: 56px;
      }
    `};
`;

const UPLOAD_SERVICE = 'https://up-z2.qiniup.com';
const UPLOAD_FILE_NAME = 'file';

export default class UploadImage extends Component {
  static propTypes = {
    onFile: PropTypes.func,
    children: PropTypes.any,
    maxCount: PropTypes.any,
    onUploadFinish: PropTypes.func,
    onDeleted: PropTypes.func,
    onChange: PropTypes.func,
    onProccess: PropTypes.func,
    token: PropTypes.string,
    host: PropTypes.string,
    showRemoveIcon: PropTypes.bool
  };

  static defaultProps = {
    maxCount: 5,
    showRemoveIcon: true
  };

  constructor(props) {
    super(props);
    this.state = {
      fileList: this.getFileListProps(props),
      visible: false,
      url: ''
    };
  }

  getFileListProps(props) {
    if (props.value) {
      let value = props.value;

      if (typeof props.value === 'string') {
        value = [props.value];
      }
      return value.map((file, key) => {
        return { uid: key, url: file };
      });
    }

    return [];
  }

  handleChange = ({ fileList, file }) => {
    // if (this.props.cropper && file.status !== 'removed') {
    //   return;
    // }

    // fileList.map(file => {
    //   if (file.response) {
    //     file.url = `${this.props.host}/${file.response.hash}`;
    //   }
    // });

    // this.onFileListField(fileList);
    // this.setState({ fileList });

    if (file.status === 'uploading') {
      this.setState({ fileList });
      return;
    }

    if (file.status === 'done') {
      fileList.map(file => {
        if (file.response) {
          file.url = `${this.props.host}/${file.response.hash}`;
        }
      });

      this.setState({ fileList });
      this.onFileListField(fileList);
    } else if (file.status === 'removed') {
      this.setState({ fileList });
      const { onChange } = this.props;
      onChange && onChange(fileList);
    }
  };

  handleBeforeUpload = (file, fileList) => {
    if (fileList.length > this.props.maxCount) {
      message.error(`图片数量超出限制`);
      return false;
    }

    const isLt1M = file.size / 1024 / 1024 < 3;
    if (!isLt1M) {
      message.error('图片大小不超过3M');
      return isLt1M;
    }

    // 开启裁剪功能
    if (this.props.cropper) {
      const URL = window.URL || window.webkitURL;
      const _url = URL.createObjectURL(file);

      this.setState({ visible: true, url: _url });
      return false;
    }

    return isLt1M;
  };

  handleCropFinish = image => {
    const { fileList } = this.state;

    const { host } = this.props;
    const url = `${host}/${image}`;
    const file = { uid: +new Date(), url };

    fileList.push(file);
    this.setState({ visible: false, fileList: fileList });

    this.onFileListField(fileList, url);
  };

  handleCropCancel = () => {
    this.setState({ visible: false });
  };

  onFileListField(fileList, url) {
    const files = fileList.map(file => {
      return {
        uid: file.uid,
        url: file.url ? file.url : url
      };
    });

    const { onChange } = this.props;
    onChange && onChange(files);

    return files;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      if (typeof nextProps.value === 'string') {
        return { uid: +new Date(), url: nextProps.value };
      }

      const fileList = nextProps.value.map((file, key) => {
        if (typeof file === 'string') {
          return { uid: key, url: file };
        } else {
          return file;
        }
      });

      this.setState({ fileList });
    }
  }

  render() {
    const { token, maxCount, small, multiple, disabled } = this.props;
    const { fileList } = this.state;

    return (
      <Wrapper small={small}>
        <Upload
          disabled={disabled}
          listType="picture-card"
          accept="image/jpeg,.jpeg,.jpg,image/png,.png"
          action={UPLOAD_SERVICE}
          name={UPLOAD_FILE_NAME}
          data={{ token }}
          fileList={fileList}
          multiple={multiple}
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: this.props.showRemoveIcon
          }}
          beforeUpload={this.handleBeforeUpload}
          onChange={this.handleChange}
        >
          {maxCount > fileList.length && (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          )}
        </Upload>
        {this.state.visible ? (
          <Crop
            src={this.state.url}
            onFinish={this.handleCropFinish}
            onCancel={this.handleCropCancel}
            host={this.props.host}
            action={UPLOAD_SERVICE}
            name={UPLOAD_FILE_NAME}
            token={token}
          />
        ) : null}
      </Wrapper>
    );
  }
}

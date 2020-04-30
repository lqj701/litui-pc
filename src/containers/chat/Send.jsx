import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 90px;
  outline: 0;
  border: 0;
  resize: none;
`;

const Button = styled.button`
  outline: 0;
  border: 0;
  background: #4a8cf2;
  width: 82px;
  height: 32px;
  line-height: 32px;
  color: #fff;

  &:hover {
    background: rgba(74, 140, 242, 0.85);
  }
`;
const TextRight = styled.div`
  text-align: right;
`;

export default class Send extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onValueChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState({ value });

    const { onChange } = this.props;
    onChange && onChange(value);
  };

  handleClick = () => {
    this.setState({ value: '' });
    const { onValueChange } = this.props;
    onValueChange && onValueChange(this.state.value);
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  };

  render() {
    const { value } = this.state;

    return (
      <Wrapper>
        <Textarea
          placeholder="请输入"
          value={value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <TextRight>
          <Button onClick={this.handleClick}>发送</Button>
        </TextRight>
      </Wrapper>
    );
  }
}

import React from 'react';
import propTypes from 'prop-types';

import { Wrapper, Input, Button } from './Styled';

export default class ChatInput extends React.Component {
  static propTypes = {
    onChange: propTypes.func,
    onValueChange: propTypes.func,
    text: propTypes.string,
    style: propTypes.object,
  };

  static defaultProps = {
    text: '发送',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  setFocus() {
    this.input.focus();
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState({ value });

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  handleClick = () => {
    this.setState({ value: '' });
    this.setFocus();

    this.valueChange();
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  };

  valueChange() {
    const { value } = this.state;
    const { onValueChange } = this.props;
    if (onValueChange) {
      onValueChange(value);
    }
  }

  componentDidUpdate() {
    // this.setFocus();
  }

  componentDidMount() {
    // this.setFocus();
  }

  render() {
    const { text, style, ...other } = this.props;
    const { value } = this.state;
    return (
      <Wrapper style={style}>
        <Input
          {...other}
          innerRef={ref => (this.input = ref)}
          value={value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <Button onClick={this.handleClick}>{text}</Button>
      </Wrapper>
    );
  }
}

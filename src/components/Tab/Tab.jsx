import React, { PureComponent } from 'react';
import { Wrapper, Header, Content, Ul, Li, Prefix, Suffix } from './Styled';
import TabPanel from './TabPanel';

export default class Tab extends PureComponent {
  static Panel;

  static defatulProps = {
    disabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || this.getActiveIndex(props.children) || 0
    };
  }

  getActiveIndex(children) {
    let activeIndex;
    React.Children.forEach(children, (item, index) => {
      if (item.props && item.props.active) {
        activeIndex = index;
      }
    });
    return activeIndex;
  }

  handleClick = (tab, index) => {
    const { disabled, onChange } = this.props;

    if (disabled || tab.props.disabled) {
      return;
    }

    this.setState({ value: index });

    if (onChange) {
      onChange(index);
    }
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps || this.getActiveIndex(nextProps.children)) {
      this.setState({
        value:
          nextProps.value ||
          nextProps.defaultValue ||
          this.getActiveIndex(nextProps.children) ||
          0
      });
    }
  }

  render() {
    const { title, extra, children } = this.props;
    const { value } = this.state;
    const renderLi = React.Children.map(children, (items, index) => {
      return (
        <Li
          active={value === index}
          disabled={items.props.disabled}
          onClick={() => this.handleClick(items, index)}
        >
          {items.props.title}
        </Li>
      );
    });

    const renderContent = React.Children.map(children, (items, index) => {
      return <TabPanel active={value === index} {...items.props} />;
    });

    return (
      <Wrapper>
        <Header>
          <Prefix>{title}</Prefix>
          <Ul>{renderLi}</Ul>
          <Suffix>{extra}</Suffix>
        </Header>
        <Content>{renderContent}</Content>
      </Wrapper>
    );
  }
}

// import React, { PureComponent } from 'react';
// import styled, { css } from 'styled-components';

// export const Wrapper = styled.div``;

// export const Ul = styled.ul`
//   display: flex;
//   list-style: none;
//   margin: 0;
//   padding: 0;
//   height: 38px;
//   line-height: 38px;
//   position: relative;

//   ::before {
//     content: ' ';
//     border-top: 1px solid #ddd;
//     position: absolute;
//     left: 0;
//     right: 0;
//     bottom: 0;
//   }
// `;

// export const Li = styled('li')`
//   text-align: center;
//   color: #333;
//   cursor: pointer;

//   font-size: 14px;
//   color: rgba(0, 0, 0, 0.85);
//   background-color: #fafafa;
//   margin-right: 2px;
//   border-top: 1px solid #ddd;
//   border-left: 1px solid #ddd;
//   border-right: 1px solid #ddd;
//   padding: 0 16px;

//   ${({ active }) =>
//     active &&
//     css`
//       background-color: white;
//       position: relative;
//       z-index: 2;
//     `};

//   ${({ disabled }) =>
//     disabled &&
//     css`
//       color: #bbb;
//       cursor: not-allowed;
//     `};
// `;

// export default class Index extends PureComponent {
//   static defaultProps = {
//     disabled: false,
//     dataSource: []
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       value: props.value || this.getActiveIndex(props.children) || 0
//     };
//   }

//   getActiveIndex(children) {
//     let activeIndex;
//     React.Children.forEach(children, (item, index) => {
//       if (item.props && item.props.active) {
//         activeIndex = index;
//       }
//     });
//     return activeIndex;
//   }

//   handleClick = (tab, index) => {
//     const { onChange } = this.props;

//     this.setState({ value: index });

//     if (onChange) {
//       onChange(index);
//     }
//   };

//   render() {
//     const { value } = this.state;
//     const { dataSource } = this.props;

//     return (
//       <Wrapper>
//         <Ul>
//           {dataSource.map((data, index) => {
//             return (
//               <Li
//                 key={index}
//                 active={value === index}
//                 onClick={() => this.handleClick(data, index)}
//               >
//                 {data.title}
//               </Li>
//             );
//           })}
//         </Ul>
//       </Wrapper>
//     );
//   }
// }

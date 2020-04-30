import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Card, Pagination, Row, Col, Switch, Input } from 'antd';
import { fetchCards, updateCard } from '../../actions/card';
import ImgCard from '../../../assets/images/card-bg.png';
const Search = Input.Search;

const Img = styled.img`
  position: absolute;
  top: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;
const CardName = styled.span`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
`;

const SwitchWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 10px;
  text-align: right;
`;

const CardStyled = styled(Card)`
  background: url(${ImgCard});
  background-size: cover;
  height: 164px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 10px;
  margin-top: 10px;
`;

const Header = styled.h1`
  position: relative;
  display: flex;
  margin-bottom: 0;
  font-size: 20px;
  height: 45px;
  line-height: 45px;
`;

const Title = styled.span`
  padding-right: 60px;
`;

const TextOverflow = styled.div`
  width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TipsStyled = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  position: relative;
  padding: 16px 16px;
  background: #fff;
`;

export class List extends Component {
  static propTypes = {
    fetchCards: PropTypes.func,
    updateCard: PropTypes.func,
    pageSize: PropTypes.any,
    isFetching: PropTypes.any,
    data: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.row = 9;
    this.page = 1;
  }

  getCards() {
    return this.props.fetchCards({
      row: this.row,
      page: this.page
    });
  }

  handlePaginationChange = page => {
    this.page = page;
    this.getCards();
  };

  handleSwitchChange = (value, id) => {
    this.props.updateCard({
      bCardId: id,
      isDefault: value
    });
  };

  handleSearch = value => {
    if (value) {
      this.props.fetchCards({
        row: this.row,
        page: 1,
        keyword: value
      });
    } else {
      this.props.fetchCards({
        row: this.row,
        page: 1
      });
    }
  };

  componentDidMount() {
    this.getCards();
  }

  render() {
    const { data, pageSize, isFetching } = this.props;

    const Cards = () => {
      let start = 0;
      let end = 9;
      let cellsPerRow = 3;
      const length = data.length;
      const rows = [];

      for (let i = start; i < end; i += cellsPerRow) {
        const row = [];
        for (let j = 0; j < cellsPerRow; j += 1) {
          const index = i + j;

          const card = index < length ? data[index] : null;
          row.push(
            card ? (
              <Col span={8} key={index}>
                <CardStyled bordered={false}>
                  <Img src={card.avatar} />
                  <div style={{ marginLeft: 82 }}>
                    <CardName>{card.name}</CardName>
                    <TextOverflow title={card.department}>
                      {card.department}
                    </TextOverflow>
                    <TextOverflow title={card.position}>
                      {card.position}
                    </TextOverflow>
                    <div>{card.phone1}</div>
                    <div>{card.phone2}</div>
                  </div>

                  <SwitchWrapper>
                    <Switch
                      defaultChecked={card.is_default}
                      onChange={value =>
                        this.handleSwitchChange(value, card.id)
                      }
                    />
                    <div style={{ fontSize: 12, marginTop: 5 }}>
                      设置为默认名片
                    </div>
                  </SwitchWrapper>
                </CardStyled>
              </Col>
            ) : null
          );
        }

        rows.push(
          <Row key={i} gutter={16}>
            {row}
          </Row>
        );
      }

      return <div>{rows}</div>;
    };

    return (
      <div>
        <Header>
          <Title>默认名片</Title>
        </Header>
        <div style={{ background: '#fff', padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Search
              placeholder="请输入姓名进行查询"
              onSearch={this.handleSearch}
              style={{ width: 200 }}
            />
          </div>

          {!data.length && !isFetching && <TipsStyled>暂无数据</TipsStyled>}
          {isFetching && <TipsStyled>数据加载中</TipsStyled>}
          <Cards />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              showQuickJumper
              defaultCurrent={1}
              pageSize={this.row}
              total={pageSize}
              showTotal={total => `共 ${total} 条`}
              onChange={this.handlePaginationChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.card.fetchCards;
};

const mapDispatchToProps = { fetchCards, updateCard };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);

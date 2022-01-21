import {
  Row,
  Col,
  DatePicker,
  Space,
  Statistic,
  PageHeader,
  message
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
// import { SearchFilter } from '@components/common/search-filter';
import EarningTable from 'src/components/earning/table-list';
import { earningService } from 'src/services';
import { IEarning } from 'src/interfaces';
import { getResponseError } from 'src/lib/utils';
import { connect } from 'react-redux';
import { SearchFilter } from '@components/common/search-filter';
import './earning.less';

interface IProps {
  conversionRate: number;
}

interface IStates {
  data: IEarning[];
  loading: boolean;
  pagination: {
    pageSize: number;
    total: number;
  };
  offset: number;
  sort: { sortBy: string; sorter: string };
  filter: {};
  stats?: any;
  query?: any;
  target: string;
}

class EarningPage extends PureComponent<IProps, IStates> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }
  constructor(props: IProps) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      loading: false,
      pagination: { pageSize: 10, total: 0 },
      filter: {},
      sort: { sortBy: 'createdAt', sorter: 'asc' },
      stats: null,
      target: 'performer'
    };
  }
  componentDidMount() {
    this.loadData();
    this.loadStats();
  }

  async loadData() {
    const { offset, pagination, filter, sort, query, target } = this.state;
    // var query = {};
    // if (fromDate && toDate) {
    //   query = Object.assign(query, fromDate, toDate);
    // }
    try {
      await this.setState({ loading: true });
      const resp = await earningService.search({
        offset,
        limit: pagination.pageSize,
        ...filter,
        ...sort,
        ...query,
        target
      });
      await this.setState({
        data: resp.data.data,
        pagination: { ...this.state.pagination, total: resp.data.total }
      });
    } catch (e) {
      this.showError(e);
    } finally {
      await this.setState({ loading: false });
    }
  }
  async loadStats() {
    const { query, target, filter } = this.state;
    try {
      const resp = await earningService.stats({ ...query, target, filter });
      await this.setState({ stats: resp });
    } catch (error) {
      this.showError(error);
    }
  }
  async onHandleTabChange(pagination, filters, sorter) {
    const { sort } = this.state;
    await this.setState({
      offset: (pagination.current - 1) * this.state.pagination.pageSize,
      sort: {
        ...sort,
        sortBy: sorter.field,
        sorter: sorter.order === 'ascend' ? 'asc' : 'desc'
      }
    });
    this.loadData();
  }

  async handleFilter(filter) {
    await this.setState({ filter });
    this.loadData();
    this.loadStats();
  }

  async setDateRanger(_, dateStrings: string[]) {
    if (!dateStrings[0] && !dateStrings[1]) {
      await this.setState({
        query: {},
        sort: { sortBy: 'createdAt', sorter: 'desc' }
      });
      this.loadData();
      this.loadStats();
    }
    if (dateStrings[0] && dateStrings[1]) {
      await this.setState({
        query: { fromDate: dateStrings[0], toDate: dateStrings[1] }
      });
      this.loadData();
      this.loadStats();
    } else {
      return;
    }
  }

  async showError(e) {
    const err = await Promise.resolve(e);
    message.error(getResponseError(err));
  }

  render() {
    const { data, loading, pagination, stats } = this.state;
    const { conversionRate} = this.props;
    // const sourceType = [
    //   { key: '', text: 'All' },
    //   { text: 'Sale Video', key: 'sale_video' },
    //   { text: 'Sale Product', key: 'sale_product' },
    //   { text: 'Sale Photo', key: 'sale_photo' },
    //   { text: 'Tip', key: 'tip' },
    //   { text: 'Private', key: 'private' },
    //   { text: 'Group', key: 'group' }
    // ];
    return (
      <>
        <Head>
          <title>Earning</title>
        </Head>
        <Page>
          <PageHeader
            title="Model Earning"
            style={{ padding: 0, marginBottom: 10 }}
          />
          <Row className="ant-page-header" style={{ padding: 0 }}>
            <Col md={12} xs={24}>
              {/* <Space>
                <span>My Balance:</span>
                <span style={{ color: defaultColor.primaryColor }}>
                  {performer.balance.toFixed(2)} tokens
                </span>
              </Space> */}
              <div>
                <DatePicker.RangePicker
                  disabledDate={() => loading}
                  onCalendarChange={this.setDateRanger.bind(this)}
                />
              </div>
            </Col>
            <Col md={12} xs={24}>
              {!loading && stats && (
                <Space size="large">
                  <div className="space-display">
                  <Statistic
                  className="space-custom"
                    title="Paid Tokens"
                    value={stats.data.paidPrice}
                    style={{ marginRight: '30px' }}
                    precision={2}
                  />
                  <Statistic
                    style={{ marginRight: '30px' }}
                    title="Remaining Tokens"
                    value={stats.data.remainingPrice}
                    precision={2}
                  />
                  <Statistic
                    style={{ marginRight: '30px' }}
                    title="Total Tokens"
                    value={stats.data.totalPrice}
                    precision={2}
                  />
                  <Statistic
                    style={{ marginRight: '30px' }}
                    title="Current Conversion Rate"
                    value={conversionRate || 'N/A'}
                    precision={2}
                  />
                  </div>

                </Space>
              )}
            </Col>
          </Row>
          {/* <div>
            <span>Type:</span>
            <SearchFilter
              sourceType={sourceType}
              onSubmit={this.handleFilter.bind(this)}
              notWithKeyWord={true}
            />
          </div> */}

          <div style={{ marginBottom: '20px' }}></div>
          {data ? (
            <div>
              <SearchFilter
                onSubmit={this.handleFilter.bind(this)}
                notWithKeyWord={true}
                searchWithPerformer={true}
              />
              <div style={{ marginBottom: '20px' }} />
              <EarningTable
                dataSource={data}
                rowKey="_id"
                onChange={this.onHandleTabChange.bind(this)}
                pagination={pagination}
                loading={loading}
              />
            </div>
          ) : (
            <p>There are no earning at this time.</p>
          )}
        </Page>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.settings });
export default connect(mapStateToProps)(EarningPage);

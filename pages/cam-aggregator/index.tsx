import Head from 'next/head';
import { PureComponent, Fragment } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { TableListAggregator } from '@components/aggregator-category/table-list';
import { BreadcrumbComponent } from '@components/common';
import { aggregatorService } from '@services/aggregator.service';

interface IProps {
    categoryId: string;
}

class CamAggregator extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    searching: false,
    list: [] as any,
    limit: 10,
    filter: {} as any,
    sortBy: 'createdAt',
    sort: 'desc'
  };

  async componentDidMount() {
    this.search();
  }
  async search(page = 1) {
    try {
      await this.setState({ searching: true });
      const resp = await aggregatorService.search({
        ...this.state.filter,
        limit: this.state.limit,
        offset: (page - 1) * this.state.limit,
        sort: this.state.sort,
        sortBy: this.state.sortBy
      });
      await this.setState({
        searching: false,
        list: resp.data,
        pagination: {
          ...this.state.pagination,
          total: resp.data.total,
          pageSize: this.state.limit
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      await this.setState({ searching: false });
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      sortBy: sorter.field || 'createdAt',
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    });
    this.search(pager.current);
  };

  async handleFilter(filter) {
    await this.setState({ filter });
    this.search();
  }

  render() {
    const { list, searching, pagination } = this.state;
    return (
      <Fragment>
        <Head>
          <title>Aggregator Categories</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Categories' }]} />
        <Page>
          <div style={{ marginBottom: '20px' }}></div>
          <TableListAggregator
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={pagination}
            onChange={this.handleTableChange.bind(this)}
          />
        </Page>
      </Fragment>
    );
  }
}

export default CamAggregator;

import { formatId } from '@lib/string';
import { Table, Tag } from 'antd';
import { IEarning } from 'src/interfaces';
import { formatDate } from 'src/lib/date';

interface IProps {
  dataSource: IEarning[];
  rowKey?: string;
  loading?: boolean;
  onChange: Function;
  pagination?: {};
}

const EarningTable = ({
  dataSource,
  rowKey,
  loading,
  onChange,
  pagination
}: IProps) => {
  const column = [
    {
      title: 'Transaction',
      dataIndex: 'transactionTokenId',
      key: 'transaction',
      render: (transactionTokenId: string) => formatId(transactionTokenId)
    },
    {
      title: 'From',
      dataIndex: 'userId',
      key: 'user',
      render(_, record: IEarning) {
        return (
          <span>
            {(record.sourceInfo && record.sourceInfo.username) || 'N/A'}
          </span>
        );
      }
    },
    {
      title: 'To',
      dataIndex: 'performerId',
      key: 'owner',
      render(_, record: IEarning) {
        return (
          <span>
            {(record.targetInfo && record.targetInfo.username) || 'N/A'}
          </span>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'sale_video':
            return <Tag color="magenta">Sale Video</Tag>;
          case 'sale_product':
            return <Tag color="volcano">Sale Product</Tag>;
          case 'sale_photo':
            return <Tag color="orange">Sale Photo</Tag>;
          case 'tip':
            return <Tag color="gold">Tip</Tag>;
          case 'stream_private':
            return <Tag color="blue">Private</Tag>;
          case 'stream_group':
            return <Tag color="green">Group</Tag>;
          default:
            return <Tag>{type}</Tag>
        }
      }
    },
    {
      title: 'Tokens',
      dataIndex: 'netPrice',
      key: 'netPrice',
      render: (netPrice: number) => netPrice.toFixed(2)
    },
    {
      title: 'Percent',
      dataIndex: 'commission',
      key: 'commission',
      render(commission: number) {
        return <span>{commission}%</span>;
      }
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate'
    },
    {
      title: 'Earned',
      key: 'earned',
      render: ({ netPrice, conversionRate }) =>
        (netPrice * conversionRate).toFixed(2)
    },
    {
      title: 'Is Paid',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render(isPaid: boolean) {
        return (
          <span>
            {isPaid ? (
              <Tag color="green">Yes</Tag>
            ) : (
              <Tag color="orange">No</Tag>
            )}
          </span>
        );
      }
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => formatDate(createdAt),
      sorter: true
    }
  ];
  return (
    <>
      <Table
        columns={column}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
        pagination={pagination}
        scroll={{ x: 1300, y: 500 }}
      />
    </>
  );
};

export default EarningTable;

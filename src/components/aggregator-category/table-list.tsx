import { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import {
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
interface IProps {
    dataSource: [];
    rowKey: string;
    loading: boolean;
    pagination: {};
    onChange: Function;
}

export class TableListAggregator extends PureComponent<IProps> {
    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: true
            },
            {
                title: 'Alias',
                dataIndex: 'alias',
                sorter: true
            },
            {
                title: 'Status',
                dataIndex: 'active',
                sorter: true,
                render(active: string) {
                    switch (active) {
                        case 'active':
                            return <Tag color="green">Active</Tag>;
                        case 'inactive':
                            return <Tag color="red">Inactive</Tag>;
                        default: return <Tag color="default">{active}</Tag>;
                    }
                }
            },
            // {
            //     title: 'Tags',
            //     dataIndex: 'tags'
            // },
            {
                title: 'Acions',
                dataIndex: '_id',
                fixed: 'right' as 'right',
                render: (data, record) => {
                    return (
                        <DropdownAction
                            menuOptions={[
                                {
                                    key: 'update',
                                    name: 'Update',
                                    children: (
                                        <Link
                                            href={{
                                                pathname: '/cam-aggregator/update',
                                                query: { id: record._id }
                                            }}
                                            as={`/cam-aggregator/update?id=${record._id}`}
                                        >
                                            <a>
                                                <EditOutlined /> Update
                                            </a>
                                        </Link>
                                    )
                                },
                                // {
                                //   key: 'delete',
                                //   name: 'Delete',
                                //   children: (
                                //     <span>
                                //       <DeleteOutlined /> Delete
                                //     </span>
                                //   ),
                                //   onClick: () =>
                                //     this.props.deleteGallery &&
                                //     this.props.deleteGallery(record._id)
                                // }
                            ]}
                        />
                    );
                }
            }
        ];
        const { dataSource, rowKey, loading, pagination, onChange } = this.props;
        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={rowKey}
                loading={loading}
                pagination={pagination}
                onChange={onChange.bind(this)}
                scroll={{ x: 700, y: 650 }}
            />
        );
    }
}

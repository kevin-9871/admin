import { PureComponent, createRef } from 'react';
import { Form, Input, Button, InputNumber, Select, Checkbox, Switch } from 'antd';
import { IGalleryCreate, IGalleryUpdate } from 'src/interfaces';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { FormInstance } from 'antd/lib/form';
import { AggregatorCategoryUpdate } from 'src/interfaces/aggregator-categories';

interface IProps {
  category?: AggregatorCategoryUpdate;
  onFinish: Function;
  submitting?: boolean;
}

export class FormAggregator extends PureComponent<IProps> {
  formRef: any;
  state = {
  };

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { category, onFinish, submitting } = this.props;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={
          category
        }
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="alias"
          label="Alias"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {category.tags && category.tags.length > 0 && (
          <Form.Item name="tags"
            label="Tags"
            rules={[{ type: 'array', required: true }]}
            extra="You can use tag to search model!"
          >
            <Select mode="tags"/>
          </Form.Item>)}
        <Form.Item
          name="active"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ float: 'right' }}
            loading={submitting}
          >
            Submit
        </Button>
        </Form.Item>
      </Form>
    );
  }
}

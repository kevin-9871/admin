import { PureComponent } from 'react';
import { Form, Button, message, InputNumber } from 'antd';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  required: 'This field is required!'
};

interface IProps {
  onFinish: Function;
  commission?: number;
  submiting?: boolean;
}

export default class StudioCommissionForm extends PureComponent<IProps> {
  render() {
    const { commission, onFinish, submiting } = this.props;
    return (
      <Form
        layout={'vertical'}
        name="form-performer-commission"
        onFinish={onFinish.bind(this)}
        onFinishFailed={() =>
          message.error('Please complete the required fields.')
        }
        validateMessages={validateMessages}
        initialValues={
          commission
            ? { commission: commission }
            : {
                commission: 20
              }
        }
      >
        <Form.Item
          name="commission"
          label="Commission"
          rules={[
            {
              validator: (_, value) => {
                if (parseInt(value) > 0 && parseInt(value) < 100) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'Value must be greater than 0 and less than 100'
                );
              }
            }
          ]}
        >
          <InputNumber min={1} max={99} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
          <Button type="primary" htmlType="submit" loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

import React from "react";
import { Form, Button, Input } from "antd";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

export const UpdatePaswordForm = ({ onFinish, updating = false }) => {
  return (
    <Form name="nest-messages" onFinish={onFinish.bind(this)} {...layout}>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            min: 6,
            max: 14,
            message: 'Passoword should be 6-14 characters'
          }
        ]}
      >
        <Input.Password placeholder="Enter password. At least 6 characters" />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Button type="primary" htmlType="submit" loading={updating}>
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

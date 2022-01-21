import { PureComponent, createRef, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  InputNumber,
  Popover
} from 'antd';
import { IMenuCreate, IMenuUpdate } from 'src/interfaces';
import { FormInstance } from 'antd/lib/form';
import { SelectMenuTreeDropdown } from './common/menu-tree.select';
import { SelectPostDropdown } from '@components/post/select-post-dropdown';
import { isUrl } from '@lib/string';
import Link from 'next/link';
import { QuestionCircleOutlined } from '@ant-design/icons';
interface IProps {
  menu?: IMenuUpdate;
  onFinish: Function;
  submitting?: boolean;
}
export class FormMenu extends PureComponent<IProps> {
  formRef: any;
  isPage: boolean;
  state = {
    isPage: false,
    isInternal: false,
    path: ''
  };
  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { menu } = this.props;
    if (menu) {
      this.setState({
        isPage: menu.isPage,
        isInternal: menu.internal,
        path: menu.path
      });
    }
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { menu, onFinish, submitting } = this.props;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          menu
            ? menu
            : ({
                title: '',
                path: '',
                help: '',
                public: false,
                internal: false,
                parentId: null,
                section: 'footer',
                ordering: 0,
                isPage: false,
                isNewTab: false
              } as IMenuCreate)
        }
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          name="internal"
          label={
            <Fragment>
              <Popover
                content={
                  <p>
                    Using system website Static Page as menu item or external
                    link
                  </p>
                }
              >
                <a style={{ marginRight: '5px' }}>
                  <QuestionCircleOutlined />
                </a>
              </Popover>
              From sytem page?
            </Fragment>
          }
          valuePropName="checked"
        >
          <Switch
            defaultChecked={false}
            onChange={(val) => {
              this.setState({ isInternal: val });
              if (!val) {
                this.setFormVal('path', '');
                this.setFormVal('isPage', false);
                this.setState({ isPage: false, path: '' });
              }
            }}
          />
        </Form.Item>
        <Form.Item name="isNewTab" label="Is new tab?" valuePropName="checked">
          <Switch defaultChecked={false} />
        </Form.Item>
        {/* {this.state.isInternal && (
          <Form.Item
            name="isPage"
            label={
              <Fragment>
                <Popover
                  content={<p>Checked if menu item system website Static Page and vice versa.</p>}>
                  <a style={{ marginRight: '5px' }}>
                    <QuestionCircleOutlined />
                  </a>
                </Popover>
                Is Page?
              </Fragment>
            }
            valuePropName="checked">
            <Switch
              defaultChecked={false}
              onChange={val => {
                this.setState({ isPage: val });
                if (!val) {
                  this.setFormVal('path', '');
                  this.setState({ path: '' });
                }
              }}
            />
          </Form.Item>
        )} */}
        {this.state.isInternal && (
          <Form.Item
            label={
              <Fragment>
                <Popover
                  content={
                    <p>
                      If there is no data, please create a page at{' '}
                      <Link href="/posts/create">
                        <a>here</a>
                      </Link>
                    </p>
                  }
                  title="Pages listing"
                >
                  <a style={{ marginRight: '5px' }}>
                    <QuestionCircleOutlined />
                  </a>
                </Popover>
                Page
              </Fragment>
            }
          >
            <SelectPostDropdown
              defaultValue={
                this.state.path && this.state.path.replace('/page/', '')
              }
              onSelect={(val) => {
                this.setFormVal('path', val ? '/page/' + val : '');
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input title of menu!' }]}
          label="Title"
        >
          <Input placeholder="Enter menu title" />
        </Form.Item>
        {this.state.isInternal ? (
          <Form.Item
            name="path"
            rules={[
              { required: true, message: 'Please input path of menu!' },
              {
                validator: (rule, value) => {
                  if (!value) return Promise.resolve();
                  const isUrlValid = isUrl(value);
                  if (this.state.isInternal && isUrlValid) {
                    return Promise.reject('The path is not valid');
                  } else if (!this.state.isInternal && !isUrlValid) {
                    return Promise.reject('The url is not valid');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            label="Path"
          >
            <Input placeholder="Enter menu path" disabled={this.state.isPage} />
          </Form.Item>
        ) : (
          <Form.Item
            name="path"
            rules={[
              { required: true, message: 'Please input url of menu!' },
              {
                validator: (rule, value) => {
                  if (!value) return Promise.resolve();
                  const isUrlValid = isUrl(value);
                  if (this.state.isInternal && isUrlValid) {
                    return Promise.reject('The path is not valid');
                  } else if (!this.state.isInternal && !isUrlValid) {
                    return Promise.reject('The url is not valid');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            label="Url"
          >
            <Input placeholder="Enter menu url" disabled={this.state.isPage} />
          </Form.Item>
        )}
        {/* <Form.Item name="help" label="Help">
          <Input placeholder="Help" />
        </Form.Item> */}
        <Form.Item
          name="section"
          label="Section"
          rules={[{ required: true, message: 'Please select menu section!' }]}
        >
          <Select disabled>
            <Select.Option key="main" value="main">
              Main
            </Select.Option>
            <Select.Option key="header" value="header">
              Header
            </Select.Option>
            <Select.Option key="footer" value="footer">
              Footer
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="parentId" label="Parent">
          <SelectMenuTreeDropdown
            defaultValue={menu && menu.parentId}
            onSelect={(val) => this.setFormVal('parentId', val)}
            menu={menu || null}
          />
        </Form.Item>
        {/* <Form.Item name="public" label="Public" valuePropName="checked">
          <Switch defaultChecked={true} />
        </Form.Item> */}
        <Form.Item name="ordering" label="Ordering">
          <InputNumber
            type="number"
            placeholder="Enter ordering of menu item"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

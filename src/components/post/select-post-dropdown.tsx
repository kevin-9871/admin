import { PureComponent } from 'react';
import { Select } from 'antd';
import { sortBy } from 'lodash';
import { postService } from '@services/post.service';
const { Option } = Select;

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  defaultValue?: any;
  onSelect: Function;
  disabled?: boolean;
}

export class SelectPostDropdown extends PureComponent<IProps> {
  _initalData = [];
  state = {
    data: [] as any,
    value: undefined
  };

  componentDidMount() {
    this.loadPosts();
  }

  async loadPosts(q?: string) {
    // TODO - should check for better option?
    const resp = await postService.search({ limit: 1000 });
    this._initalData = sortBy(resp.data.data, i => i.slug);
    this.setState({
      data: [...this._initalData]
    });
  }

  handleSearch = value => {
    const q = value.toLowerCase();
    const filtered = this._initalData.filter(p => {
      return p.slug.includes(q) || (p.title || '').toLowerCase().includes(q);
    });
    this.setState({ data: filtered });
  };

  render() {
    const { disabled } = this.props;
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={true}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.props.onSelect.bind(this)}
        notFoundContent={null}
        defaultValue={this.props.defaultValue || undefined}
        disabled={disabled}
        allowClear>
        {this.state.data.map(p => (
          <Option key={p._id} value={p.id}>
            <span>
              <strong>{p.slug}</strong> / <span>{p.title}</span>
            </span>
          </Option>
        ))}
      </Select>
    );
  }
}

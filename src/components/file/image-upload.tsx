import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PureComponent } from 'react';
import env from '../../env';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const isImageAccept = env.imageAccept
    .split(',')
    .map((item: string) => item.trim())
    .indexOf(`.${ext}`);
  if (isImageAccept === -1) {
    message.error(`You can only upload ${env.imageAccept} file!`);
  }
  const isLt2M = file.size / 1024 / 1024 < (env.maximumSizeUploadImage || 2);
  if (!isLt2M) {
    message.error(
      `Image must smaller than ${env.maximumSizeUploadImage || 2}MB!`
    );
  }
  return isImageAccept > -1 && isLt2M;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  options?: any;
}

export class ImageUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    imageUrl: this.props.imageUrl
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false
        });
        this.props.onUploaded &&
          this.props.onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
    }
  };

  render() {
    const { options = {} } = this.props;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    const { headers, uploadUrl } = this.props;
    return (
      <Upload
        name={options.fieldName || 'file'}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        headers={headers}
        accept={env.imageAccept}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="file" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

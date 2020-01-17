import React from 'react';
import {
  Upload, Form, Icon, message, Modal
} from 'antd';
import './less/uploadImg.less';
const FormItem = Form.Item;

class UploadImg extends React.Component {
  constructor(props) {
    super(props);
    this.props.triggerRef(this);
    this.state = {
      imgStatus: '',
      imgInfo: '',
      loading: false,
      previewVisible: false,
      previewImage: '',
    }
  }
  componentDidMount() {
  }

  checkPhoto = (rule, value, callback, msg, status, info) => {
    if (value === '' || value.fileList.length === 0) {
      // this.setState({
      //   [status]: 'error',
      //   [info]: msg
      // });
    }
    callback();
  }
  beforeUpload = (file) => {
    const { imgSize, imgSizeTips } = this.props;
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
    if (!isJPG) {
      message.error('格式要求jpg、jpeg、png!');
    }
    const isLt4M = file.size / 1024 / 1024 < (imgSize || 5);
    if (!isLt4M) {
      message.error(`图片不能超过${imgSizeTips || '5M'}!`);
    }
    return isJPG && isLt4M;
  }
  uploadConfig = (validateStatus, tip) => {
    const that = this;
    const { updateImg, name, uploadUrl } = this.props;
    return {
      action: uploadUrl,
      listType: 'picture-card',
      onChange(info) {
        if (info.file.status === 'uploading') {
          that.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === '0') {
            message.success(`${info.file.name} 上传完成`);
            // 修改图片
            updateImg(name, info.file, `${name}Edit`);
            that.setState({
              [validateStatus]: 'success',
              [tip]: ''
            });
          } else {
            updateImg(name, '', `${name}Edit`);
            message.error(`${info.file.name} 上传失败`);
            that.setState({
              [validateStatus]: 'error',
              [tip]: '图片上传失败，请重新上传'
            });
          }
        }
        if (info.file.status === 'error') {
          that.setState({
            [validateStatus]: 'error',
            [tip]: '图片上传失败，请重新上传'
          });
        }
      },
      onRemove(file) {
        that.setState({
          [validateStatus]: 'error',
          [tip]: '请上传图片'
        });
        updateImg(name, '', `${name}Edit`);
      }
    };
  }
  btnSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        this.setState({
          imgStatus: 'error',
          imgInfo: '请上传图片'
        });
      }
    });
  }
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  render() {
    const { label, initialValue, form, name, col, disabled, previewImageWidth } = this.props;
    const { previewVisible, previewImage } = this.state;
    let defaultImg = [];
    // 初始化图片的值
    const initFileImg = { fileList: [], flag: true };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    if (initialValue) {
      defaultImg = [{
        uid: 1,
        name: 'xxx.jpg',
        status: 'done',
        url: initialValue,
      }];
      initFileImg.fileList = defaultImg;
    }
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: col.labelColSpan || '4' },
      wrapperCol: { span: col.wrapperColSpan || '8' },
    };
    const { imgStatus, imgInfo } = this.state;
    return (
      <Form>
        <FormItem
          label={label}
          {...formItemLayout}
          validateStatus={imgStatus}
          help={imgInfo !== '' ? imgInfo : ''}
          hasFeedback
          className="upload-img"
        >
          {getFieldDecorator(name, {
            initialValue: initFileImg.fileList.length === 0 ? '' : initFileImg,
            rules: [
              { validator: (rule, value, callback) => { this.checkPhoto(rule, value, callback, '请上传图片', 'imgStatus', 'imgInfo'); } },
              { required: this.props.isRequred || false, message: '图片不能为空' }
            ],
          })(
            <Upload
              {...this.uploadConfig('imgStatus', 'imgInfo')}
              name="filename"
              disabled={disabled}
              defaultFileList={defaultImg}
              beforeUpload={this.beforeUpload}
              onPreview={this.handlePreview}
            >
              {this.props.form.getFieldValue(name) && this.props.form.getFieldValue(name).fileList.length > 0 ? null : uploadButton}
            </Upload>
          )}
        </FormItem>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={previewImageWidth || 1200}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(UploadImg);

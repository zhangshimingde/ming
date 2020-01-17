import React from 'react';
import { Modal } from 'antd';
import './less/modal.less';
import config from './config';

class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { btnDetailCancel, btnDetailSubmit, title, width, okText, cancelText } = this.props;
    let obj = {};
    if (!btnDetailSubmit) {
      obj = { footer: null };
    }
    return (
      <Modal
        className="detail-modal"
        title={title||'查看详情'}
        visible
        onOk={this.btnOk}
        onCancel={btnDetailCancel}
        width={`${width || 800}px`}
        centered
        maskClosable={false}
        okText={okText || '确定'}
        cancelText={cancelText || '取消'}
        {...obj}
      >
        <div>
          {config.map((item) => (
            <React.Fragment>
              <div className="detail-modal-title">{item.title}：</div>
              <div className="linediv clearfix">
                {item.info.map((infoItem) => (
                  <div className="itemdiv">
                    <label className="black-color ">{infoItem.label}</label>
                    <p className="gray-color ">{infoItem.name}</p>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
          {this.props.children}
        </div>
      </Modal>
    );
  }
}

export default DetailModal;

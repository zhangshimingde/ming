import React, { Component } from 'react';
import {
    Spin, Modal, message, Button
} from 'antd';
import { connect } from 'dva';
@connect((state) => state)
class SpecialModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {

    }
    btnCancal = () => {
        // 获取父组件的this属性
        this.props.hideModal('showSpecialModal');
    }
    btnOk = () => {
        this.props.onOk();
    }
    render() {
        // const { btnDetailCancel, btnDetailSubmit, title, width, okText, cancelText } = this.props;
        return (
            <Modal
                className="detail-modal"
                title={'查看详情'}
                visible
                onOk={this.btnOk}
                onCancel={this.btnCancal}
                width={`800px`}
                maskClosable={false}
                okText={'确定'}
                cancelText={'取消'}
            >
                <div>
                    第一个弹框
                </div>
            </Modal>
        )

    }
}
export default SpecialModal
// const mapStateToProps = (state) => {
//     return {
//         ...state
//     };
// }
// export default connect(mapStateToProps)(SpecialModal);

import React, { Component } from 'react';
import {
    Spin, Modal, message, Button
} from 'antd';
import { connect } from 'dva';
import './less/detailModa.less';
@connect((state) => state)
class ShowDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: props.record,
            detailInfo: {}
        }
    }
    componentWillMount() {
        this.getDetailInfo();
    }
    getDetailInfo = () => {
        const { record } = this.props;
        this.props.dispatch({
            type: `usePage/usePageDetail`, payload: {
                id: record.id
            }
        }).then((res) => {
            const { code, data } = res;
            if (code === '0') {
                this.setState({
                    detailInfo: data
                })
            }
            else {
                message.error(res.message);
            }
        });
    }
    btnCancal = () => {
        this.props.onCancel();
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
                centered
                maskClosable={false}
                okText={'确定'}
                cancelText={'取消'}
            >
                <div>
                    我是详情页
                </div>
            </Modal>
        )

    }
}
export default ShowDetailModal
// const mapStateToProps = (state) => {
//     return {
//         ...state
//     };
// }
// export default connect(mapStateToProps)(showDetailModal);

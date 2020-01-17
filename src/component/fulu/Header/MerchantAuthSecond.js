import React, { Component } from 'react';
import { Modal, Radio, Row, Col, Button } from 'antd';

import service from '../utils/service';

class MerchantAuthSecond extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            subjectId: 0,  // 选择主体id
            merchentName: '' // 商户名称
        };
    }

    onChange = (e) => {
        const f = this.props.authMerchants.find(item => item.memberId == e.target.value);
        if (f) {
            this.setState({
                merchentName: f.affiliatedCompanyName,
                subjectId: e.target.value,
            })
        }
        else 
            this.setState({
                subjectId: e.target.value,
            })
    }

    gotoAuthPage = () => {
        service.AuthMerchantByCopy(this.state.subjectId).then((res) => {
            if (res.code == '0') {
                this.props.close();
                // this.props.history.push('/');
                this.props.history.push('/authen/2');
            }
        });
    }

    onSetpOneOk = () => {
        if (this.state.subjectId == 0) {
            this.props.close();
            this.props.history.push('/authen/2');
        }
        else {
            this.setState({
                step: 2,
            })
        }
    }
    render() {
        const { step, subjectId, merchentName } = this.state;
        const { authMerchants = [] } = this.props;

        let Footer = [
            <Button type="primary" key="next" onClick={this.onSetpOneOk} >确定</Button>
        ];
        if (step == 2) {
            Footer = [
                <Button type="primary" key="back" onClick={() => this.gotoAuthPage()} >确定</Button>,
                <Button key="ok" onClick={() => this.setState({ step: 1 })} >返回</Button>
            ];
        }

        return (
            <Modal
                visible={true}
                title="商户主体选择"
                footer={Footer}
                closable={false}
            >
                {
                    step == 1 &&
                    <Radio.Group
                        value={subjectId}
                        onChange={this.onChange}
                        style={{ width: '100%' }}>
                        {
                            authMerchants.map((item) => {
                                return <Col span={12} key={item.memberId}><Radio value={item.memberId}>{item.affiliatedCompanyName}</Radio></Col>
                            })
                        }
                        <Col span={12}><Radio value={0}>新增</Radio></Col>
                    </Radio.Group>
                }
                {
                    step == 2 &&
                    <p style={{ textAlign: 'center' }}>
                        确认选择 <span style={{ color: '#3983d7'}}>{merchentName}</span> 作为本商户的主体？
                    </p>
                }
                <div style={{ marginTop: 20, color: '#919191', fontSize: 12 }}>
                    <p>注意：</p>
                    <ol style={{
                        listStyleType: 'decimal',
                        marginBlockStart: '1em',
                        marginBlockEnd: '1em',
                        marginInlineStart: '0px',
                        marginInlineEnd: '0px',
                        paddingInlineStart: '40px',
                    }}>
                        <li>商户主体确认后不可更改，请慎重选择</li>
                        <li>个人实名认证的商户如果交给他人使用且产生纠纷时，平台方不予负责</li>
                        <li>如企业使用的账号进行个人实名认证，在人员变动交接账号或账号下财产出现纠纷时，平台方不予负责</li>
                    </ol>
                </div>
            </Modal>
        );
    }
}

export default MerchantAuthSecond;
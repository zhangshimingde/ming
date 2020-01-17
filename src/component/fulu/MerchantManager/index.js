import React, { Component } from 'react';
import { Icon, Layout, message } from 'antd';
import getUserCenterUrl from '../../../configs/UserCenterUrl';
import MyModal from './MyModal';
import Logo from '../Logo';
import service from '../utils/service';

import "./less/index.less";
import "../Header/index.less";

const { Content } = Layout;
const ADD = 'add'; // 创建商户
const EDIT = 'edit'; // 编辑商户备注

class MerchantManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalType: ADD,
            editData: {},
            list: props.merchants,
        }
        this.handleMerchant = this.handleMerchant.bind(this);
    }

    componentDidMount() {
        // 商户管理区不是自定义时，执行初始化查询
        // if (!this.props.CustomManageZone) {
        //     this.getList();
        // }
    }
    
    componentWillReceiveProps(nextProps) {
        const { refreshUI } = nextProps;
        if (refreshUI && refreshUI != this.props.refreshUI && !this.props.CustomManageZone) {
            this.getList();
        }
    }
    
    getList = () => {
        service.getUserMerchants().then((res) => {
            if (res.code == '0') {
                this.setState({
                    list: res.data.list,
                });
                if (typeof this.props.updateMerchants === 'function') {
                    this.props.updateMerchants(res.data.list);
                }
            }
        });
    }

    handleOk = (data) => {
        const { modalType } = this.state;
        if (modalType === ADD) {
            service.createMerchant(data).then((res) => {
                if( res.code == '0') {
                    this.getList();
                }
            });
        } else {
            service.updateMerchantRemark(data).then((res) => {
                if( res.code == '0') {
                    message.success('修改成功');
                    this.getList();
                }
            });
        }
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            showModal: false,
            modalType: ADD,
            editData: {},
        })
    }

    // 点击退出
    handleLoginOut = () => {
        service.loginOut();
    }

    // 点击进入商户
    handleMerchant(merchant) {
        if (merchant.isOwner) {
            this.props.history.push("/");
            this.props.selectMerchant(merchant.id);
        } 
        else {
            service.existRole(merchant.id).then(res => {
                if (res.code == 0) {
                    this.props.history.push("/");
                    this.props.selectMerchant(merchant.id);
                } else {
                    if (localStorage.getItem('MerchantId')) {
                        localStorage.removeItem('MerchantId');
                    }
                }
            });
        }
        
    }
    /**
     * 编辑商户备注
     */
    handleEditRemark = ({ id, name, remark, isSupplier }) => {
        const merchantRole = isSupplier === 1 ? 2 : 1;
        this.setState({
            showModal: true,
            modalType: EDIT,
            editData: {
                id,
                name,
                remark,
                merchantRole,
            }
        });
    }
    handleAddMerchant = () => {
        if (this.remainNum === 0) {
            message.warn('商户数已达上限');
            return;
        }
        this.setState({ showModal: true })
    }
    renderMerchantZone = (data) => {
        // 0待审核  1已审核 2审核不通过
        // 商户认证状态 0未认证 1认证待审核 2认证通过 3认证不通过
        return data.map((item) => {
            if (item.auditStatus == '1') {
                let clsName = "bd ";
                if (item.isOwner) {
                    clsName += "bd-auth";
                }
                else {
                    clsName += "bd-cooper";
                }
                const { isPurchasers } = item;
                const roleName = isPurchasers === 1 ? '进货商' : '供货商';
                return (
                    <div className="merchant_card" key={item.id} onClick={() => { this.handleMerchant(item); }}>
                        <p className="code card-item" title={item.code}>{item.code}-{roleName}</p>
                        <span className="name card-item" title={item.name}>{item.name}</span>
                        <p className="remark card-item" title={item.remark}>{item.remark}</p>
                        <p className="remark card-item" title={item.balance} style={{ marginTop: '18px' }}>{item.balance}</p>
                        { !item.isOwner && <span className="tag"></span> }
                        <div className={clsName}></div>
                        {
                            item.authenticationStatus == '0' &&
                            <div className="desc" title="">待认证</div>
                        }
                        {
                            item.authenticationStatus == '1' &&
                            <div className="desc" title="">认证待审核</div>
                        }
                        {
                            item.authenticationStatus == '2' &&
                            <div className="desc" title="">{item.authenticationName}</div>
                        }
                        {
                            item.authenticationStatus == '3' &&
                            <div className="desc" title="">认证不通过</div>
                        }
                        {
                            item.isOwner && 
                                <Icon
                                    type="form"
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleEditRemark(item);
                                    }}
                                />
                        }
                    </div>
                )
            }
            else if (item.auditStatus == '0') {
                return (
                    <div className="merchant_card" key={item.id} style={{ cursor: 'default'}}>
                        <p className="code card-item" title={item.code} style={{ color: "#989898"}}>{item.code}</p>
                        <span className="name card-item" title={item.name} style={{ color: "#989898"}}>{item.name}</span>
                        <p className="remark card-item" title={item.remark} style={{ color: "#989898"}}>{item.remark}</p>
                        <p className="remark card-item" title={item.balance} style={{ color: "#989898", marginTop: '18px' }}>{item.balance}</p>
                        <div className="bd bd-apply">
                        </div>
                        <div className="desc " title="">
                            <span className="dot-blue"></span>审核中
                        </div>
                        {
                            item.isOwner && 
                                <Icon
                                    type="form"
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleEditRemark(item);
                                    }}
                                />
                        }
                    </div>
                )
            }
            else
                return null;
        })
    }
    renderTitle() {
        const { merchants, userInfo } = this.props;
        if (Array.isArray(merchants) && Object.hasOwnProperty.call(userInfo || {}, 'maxMerchantNum')) {
            const remainNum = merchants.reduce((total, { authenticationStatus, type, isOwner }) => {
                return (authenticationStatus == 2 && type == 1) || !isOwner ? total + 1 : total;
            }, +userInfo.maxMerchantNum - merchants.length);
            this.remainNum = remainNum;
            return (
                <div className="merchant_title">
                    商户管理区<span className="tips">您可创建{userInfo.maxMerchantNum}个商户，当前还可创建{remainNum}个</span>
                </div>
            );
        }
        return (
            <div className="merchant_title">
                商户管理区
            </div>
        );
    }
    render() {
        const { showModal, modalType, editData } = this.state;
        const { appName, CustomManageZone, merchants = [] } = this.props;
        return (
            <Layout>
                <div className="top" style={{ background: "#192632" }}>
                    <Logo collapsed={false} appName={appName} style={{ float: 'left', color: '#fff' }} />
                    <div className="userCenter">
                        <span className="merchant-manage-mobile">
                            <Icon type="user" style={{ fontSize: 16 }} />
                            <a href={getUserCenterUrl()} target="_blank" className="center-link">
                                <span className="tel" style={{ cursor: 'pointer' }}>{userinfo.mobile}</span>
                            </a>
                        </span>
                        <span className="logout" onClick={this.handleLoginOut}>退出</span>
                    </div>
                </div>
                <Content className="layout-content">
                {
                    CustomManageZone ? <CustomManageZone
                        toEnterApp={this.handleMerchant}
                        fetchMerchantList={this.getList}
                        merchantList={merchants}
                    /> : (
                        <div className="merchant_manager">
                           {this.renderTitle()}
                            <div className="merchant_content">
                                {
                                    this.renderMerchantZone(merchants)
                                }
                                <div
                                    className="merchant_card merchant_card_create"
                                    style={{ background: "#fff" }}
                                    onClick={this.handleAddMerchant}
                                >
                                    <div className="bd" style={{ background: "#f1f2f6"}}>
                                        <Icon type="plus" style={{ color: "#d8d8d8" }} />
                                        <div className="title" >
                                            创建商户
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                showModal && <MyModal
                                    handleOk={this.handleOk}
                                    modalType={modalType}
                                    editData={editData}
                                    handleCancel={this.handleCancel}
                                />
                            }
                        </div>
                    )
                }
                </Content>
            </Layout>
        );
    }
}

export default MerchantManager;
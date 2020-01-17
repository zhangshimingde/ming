import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Form, Upload, Button, Icon, message,
} from 'antd';
import { Service } from '../../../annotation';
import Contact from './Contact';
import ModifyPassword from './ModifyPassword';
import './less/basicInformation.less';

@Service('BasicInfoService')
@withRouter
class BasicInformation extends React.Component {
    uploadProps = {
        name: 'avator',
        action: '//jsonplaceholder.typicode.com/posts/',
        accept: '.jpg, .png, .jpeg',
        headers: {
        // authorization: 'authorization-text',
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            selectedTitle: '基本信息',
        };
    }

    handleUploadedChange = (info) => {
        if (info.file.status !== 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
        }
    }

    handleNavClick = (index, title) => {
        this.setState({
            selectedIndex: index,
            selectedTitle: title,
        });
    }

    handleGoBack = () => {
        const { history } = this.props;
        history.go(-1);
    }

    render() {
        const { FLayoutContext, service } = this.props;
        const { selectedIndex, selectedTitle } = this.state;
        return (
            <FLayoutContext.Consumer>
                {
                    ({ basicInfo }) => {
                        return (
                            <div>
                                <div className="basic-information-nav">
                                    <p
                                        className={selectedIndex === 0 ? 'active' : ''}
                                        onClick={this.handleNavClick.bind(this, 0, '基本信息')}
                                    >基本信息</p>
                                    <p
                                        className={selectedIndex === 1 ? 'active' : ''}
                                        onClick={this.handleNavClick.bind(this, 1, '联系方式')}
                                    >联系方式</p>
                                    <p
                                        className={selectedIndex === 2 ? 'active' : ''}
                                        onClick={this.handleNavClick.bind(this, 2, '我的头像')}
                                    >我的头像</p>
                                    <p
                                        className={selectedIndex === 3 ? 'active' : ''}
                                        onClick={this.handleNavClick.bind(this, 3, '修改密码')}
                                    >修改密码</p>
                                </div>
                                <div className="basic-information-content">
                                    <div className="basic-information-header">
                                        <b>{selectedTitle}</b>
                                        <Button
                                            onClick={this.handleGoBack}
                                            style={{ float: 'right', marginRight: 10 }}
                                        >
                                            返回
                                        </Button>
                                    </div>
                                    <div className="basic-information-body">
                                        <div
                                            className="information-basic"
                                            style={{ display: selectedIndex === 0 ? 'block' : 'none' }}
                                        >
                                            <p className="information-item">
                                                <span>账号：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.account}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>工号：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.enCode}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>姓名：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.realName}
                                                </span>
                                            </p>
                                            <div className="information-item">
                                                <span>性别：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.gender === 1 ? '男' : '女'}
                                                </span>
                                            </div>
                                            <p className="information-item">
                                                <span>公司：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.organizeName}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>部门：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.departmentName}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>主管：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.manager}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>岗位：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.dutyName}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>职位：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.postName}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>角色：</span>
                                                <span className="information-item-info">
                                                    {basicInfo.roleName}
                                                </span>
                                            </p>
                                            <p className="information-item">
                                                <span>自我介绍：</span>
                                                <span className="information-item-introduce">
                                                    {basicInfo.description}
                                                </span>
                                            </p>
                                        </div>
                                        <Contact
                                            userinfo={basicInfo}
                                            service={service}
                                            style={{ display: selectedIndex === 1 ? 'block' : 'none' }}
                                        />
                                        <div
                                            className="information-avator"
                                            style={{ display: selectedIndex === 2 ? 'block' : 'none' }}
                                        >
                                            <Upload
                                                {...this.uploadProps}
                                                onChange={this.handleUploadedChange}
                                            >
                                                <Button>
                                                    <Icon type="upload" /> 添加Logo
                                                </Button>
                                            </Upload>
                                            <p>建议上传图片尺寸为100x100，大小不超过2M。</p>
                                        </div>
                                        <ModifyPassword
                                            service={service}
                                            style={{ display: selectedIndex === 3 ? 'block' : 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                }
            </FLayoutContext.Consumer>
        );
    }
}

BasicInformation.propTypes = {
    history: PropTypes.object,
    FLayoutContext: PropTypes.object,
    service: PropTypes.object,
};

BasicInformation.defaultProps = {
    history: {},
    FLayoutContext: {},
    service: {},
};

export default Form.create()(BasicInformation);

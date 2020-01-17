/**
 * @desc 自定义商户管理区组件
 */
import React from 'react';
import { connect } from 'dva';

@connect(state => state)
class CustomManageZone extends React.Component {
    componentDidMount() {
        this.props.dispatch({
            type: 'customManage/fetchList',
            payload: {}
        });
    }
    render() {
        const { customManage, merchantList = [], toEnterApp } = this.props;
        const { list = [] } = customManage;
        return (
            <div>
                hahaha
                {
                    list.map((item) => {
                        return <p key={item.id}>{item.name}</p>
                    })
                }
                {
                    merchantList.map((item) => {
                        return (
                            <div className="merchant_card" key={item.id} onClick={() => { toEnterApp(item); }}>
                                <p className="code card-item" title={item.code}>{item.code}</p>
                                <span className="name card-item" title={item.name}>{item.name}</span>
                                <p className="remark card-item" title={item.remark}>{item.remark}</p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default CustomManageZone;
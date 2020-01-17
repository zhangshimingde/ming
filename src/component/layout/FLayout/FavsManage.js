import React from 'react';
import { Button, Input } from 'antd';
import Table from '../../widget/Table';
import './less/favsManage.less';

const Search = Input.Search;

class FavsManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            searchKey: '',
        };
        this.onSearch = this.onSearch.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.columns = [{
            title: '序号',
            dataIndex: 'sort',
            render: (text, record, index) => {
                return (
                    <span>{index + 1}</span>
                );
            },
        }, {
            title: '模块',
            dataIndex: 'collectTitle',
        }, {
            title: '链接',
            dataIndex: 'collectSrc',
        }, {
            title: '创建时间',
            dataIndex: 'collectTime',
        }, {
            title: '操作',
            dataIndex: 'op',
            render: (record) => {
                return (
                    <span onClick={() => {
                        this.onDelete(record);
                    }}>删除</span>
                );
            },
        }];
    }
    onDelete() {

    }
    onSearch() {
        const { searchKey, pageIndex, pageSize } = this.state;
    }
    onRefresh() {
        this.setState({
            searchKey: ''
        }, this.onSearch);
    }
    render() {
        return (
            <div className="favs-wrapper">
                <Input.Search
                    value= {this.state.searchKey}
                    style={{width:200}} 
                    onChange= {(e) => {
                        this.setState({
                            searchKey: e.target.value,
                        });
                    }}
                    placeholder="搜索您要查询的关键字"
                />
                <Button onClick={this.onRefresh} style={{ float: 'right' }}>刷新</Button>
                <Table
                    columns={this.columns}
                    dataSource={[]}
                />
            </div>
        );
    }
}

export default FavsManage;

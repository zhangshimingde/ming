/**
 * @desc 菜单搜索框组件
 */

import React from 'react';
import { Icon, Select, message } from 'antd';
import PropTypes from 'prop-types';
import './less/search.less';

const { Option } = Select;

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedList: [], // 符合搜索条件的菜单
            searchKey: '', // 搜索关键字
            selectValue: '', // 当前选中的菜单编号
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    getPopupContainer(triggerNode) {
        return triggerNode.parentNode;
    }

    handleMouseLeave(e) {
        const { target } = e;
        const searchInputDom = target.nodeName.toLowerCase() !== 'input'
            ? target.querySelector('input') : target;
        if (searchInputDom) {
            searchInputDom.blur();
        }
        this.setState({
            matchedList: [],
        });
    }

    handleSelect(moduleId, option) {
        const { menuItemList } = this.props;
        const xMenu = option.props.menu;
        const xApp = menuItemList.find((item) => { return item.appId === xMenu.appId; }) || {};
        if (xMenu.openMode === 'iframe') {
            const xPath = `/iframe/${moduleId}`;
            if (xApp.hostUrl) {
                window.location.href = `${xApp.hostUrl + xPath}?appid=${xMenu.appId}`;
            } else {
                message.error('当前菜单所属应用的host不存在');
            }
        } else if (xMenu.openMode === 'self') {
            window.location.href = `${(xApp.hostUrl || xMenu.host || '') + xMenu.urlAddress}?appid=${xMenu.appId}`;
        }
    }

    /**
   * 菜单选中事件
   * @param {string} moduleId 菜单编号
   */
    handleChange(moduleId) {
        this.setState({
            selectValue: moduleId,
        });
    }

    handleFocus() {
        const { searchKey } = this.state;
        this.handleSearch(searchKey);
    }

    handleSearch(searchKey) {
        const { menuItemList } = this.props;
        const searchKeyTrim = searchKey && searchKey.trim();
        const matchedList = menuItemList.reduce((arr, item) => {
            if (searchKeyTrim && item.fullName.indexOf(searchKeyTrim) > -1) {
                arr.push(item);
            }
            return arr;
        }, []);
        this.setState({
            matchedList,
            searchKey: searchKeyTrim,
            selectValue: searchKeyTrim,
        });
    }

    renderOptions() {
        const { matchedList } = this.state;
        return matchedList.map((item) => {
            return (
                <Option
                    key={item.moduleId}
                    menu={item}
                    title={item.fullName}
                    moduleId={item.moduleId}
                >
                    {item.fullName}
                </Option>
            );
        });
    }

    render() {
        const { selectValue } = this.state;
        return (
            <li
                className="search-wrapper"
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}
                onMouseLeave={this.handleMouseLeave}
            >
                <span className="icon-box">
                    <Icon
                        style={{
                            fontSize: '16px',
                            verticalAlign: 'middle',
                        }}
                        type="search"
                    />
                </span>
                <Select
                    mode="combobox"
                    notFoundContent=""
                    optionLabelProp="children"
                    value={selectValue}
                    className="select-box"
                    showArrow={false}
                    showSearch
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    getPopupContainer={this.getPopupContainer}
                    onSelect={this.handleSelect}
                    onSearch={this.handleSearch}
                    onFocus={this.handleFocus}
                    onChange={this.handleChange}
                    placeholder="查找菜单"
                >
                    {
                        this.renderOptions()
                    }
                </Select>
            </li>
        );
    }
}

Search.propTypes = {
    menuItemList: PropTypes.array,
};

Search.defaultProps = {
    menuItemList: [],
};

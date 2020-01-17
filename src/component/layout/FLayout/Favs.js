/**
 * @desc   收藏菜单组件视图
 * @author zhangkegui
 * @date   2018-12-18
 * @version 1.0
 */
import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DropPanel } from '../../widget';
import fav from './images/fav.svg';

class Favs extends React.Component {
    initFavs =() => {
        const { favs: favsList } = this.props;
        if (!favsList.length) {
            return <li><span className="hint-dot" /><a>没有记录</a></li>;
        }
        return favsList.slice(0, 10)
            .filter((item) => { return item.collectTitle; })
            .map((item, index) => {
                return (
                    <li key={item.id}>
                        {
                            favsList.length - 1 !== index
                            && <span className="hint-line" />
                        }
                        <span className="hint-dot" />
                        <a
                            title={item.collectTitle}
                            href={(item.host || window.location.origin) + item.collectSrc}
                        >
                            {item.collectTitle}
                        </a>
                    </li>
                );
            });
    }

    render() {
        const { favs: favsList } = this.props;
        return (
            <DropPanel
                className="anole-droppanel"
                headerStyle={{ height: 16, lineHeight: '16px' }}
                header={(
                    <Icon component={fav} />
                )}
            >
                <div className="hint-box anole-droppanel-content">
                    <ul>
                        {this.initFavs()}
                    </ul>
                    {
                        Array.isArray(favsList) && favsList.length > 0
                            ? <Link className="link-all" to="/fav">查看全部</Link> : ''
                    }
                </div>
            </DropPanel>
        );
    }
}

Favs.propTypes = {
    favs: PropTypes.array,
};

Favs.defaultProps = {
    favs: [],
};

export default Favs;

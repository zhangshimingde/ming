/**
 * @desc    底部统计行
 * @author  zhangkegui@fulu.com
 * @date    2019-6-4
 * @version 1.0
 */

import React from 'react';
import { Pagination } from 'antd';

const FooterExtra = (props) => {
    const { pagination, show } = props;
    if (!show || !pagination) {
        return null;
    }
    return (
        <Pagination
            className="outer-pagination"
            size="small"
            {...pagination}
        />
    );
};

export default FooterExtra;

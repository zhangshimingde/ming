import React from 'react';
import { Spin, Icon } from 'antd';

export default class Loading extends React.Component {
  render() {
    return (
      <div
        className="app"
        style={{ width: '100%', textAlign: 'center' }}
      >
        <Spin
          style={{ textAlign: 'center', width: '100%', marginTop: 200 }}
          indicator={<Icon type="loading" style={{ fontSize: 50 }} />} />
      </div>
    );
  }
};

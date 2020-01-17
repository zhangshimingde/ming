import React, { Component } from 'react';

class Logo extends Component {
    render() {
        const { hostUrl, collapsed, appName, style } = this.props;

        return (
            <div className="logo" style={style} onClick={() => { hostUrl && (window.location.href = hostUrl)  }}>
                <img src={require("./images/logo.png")} width="36" />
                {
                    !collapsed && <span className="title" >{appName}</span>
                }
            </div>
        );
    }
}



export default Logo;
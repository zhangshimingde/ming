import React, { Component } from 'react'

export default class HsTestPage extends Component {
    constructor(props) {
        super(props);
    }
    navigateToUrl = () => {
        const obj = { a: 1, b: 2 };
        var clientId = 'SUP', creatorName = 222, isEnable = false,name1=232323;
        const initParam = JSON.stringify(obj);
        console.log(encodeURI(initParam), 9999)
        this.props.history.push(`/searchForm?clientId=${clientId}&creatorName=${creatorName}&isEnable=${isEnable}&name1=${name1}`);
    }
    render() {
        return (
            <div onClick={this.navigateToUrl}>
                跳转Form
            </div>
        )
    }
}

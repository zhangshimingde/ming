/**
 * @desc    吸顶组件,当页面发生滚动时，该组件顶部距离浏览器视口顶部达到偏移量阈值，就会固定子组件
 * @author  zhangkegui@fulu.com
 * @date    2019-6-4
 * @version 1.0
 */

import React from 'react';

class Sticky extends React.Component {
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
    }
    componentDidMount() {
        const { scrollContainer = window } = this.props;
        this.stickyWrapper = document.querySelector('.sticky-wrapper');
        if (scrollContainer && scrollContainer.addEventListener) {
            if (this.stickyWrapper.children.length > 0) {
                this.stickyChild = this.stickyWrapper.children[0];
                scrollContainer.addEventListener('scroll', this.onScroll, false);
            }
        }
    }
    onScroll() {
        const { top = 50 } = this.props;
        const topNum = parseInt(top);
        if (!this.stickyWrapper.style.height) {
            this.stickyWrapper.style.height = window.getComputedStyle(this.stickyChild, null).height;
        }
        if (this.stickyWrapper.getBoundingClientRect().top <= topNum) {
            this.stickyChild.style.width = window.getComputedStyle(this.stickyWrapper, null).width;
            this.stickyChild.style.position = 'fixed';
            this.stickyChild.style.top = `${topNum}px`;
        } else {
            this.stickyChild.style.position = 'relative';
            this.stickyChild.style.top = 'auto';
        }
    }
    componentWillUnmount() {
        const { scrollContainer } = this.props;
        if (scrollContainer && scrollContainer.removeEventListener) {
            scrollContainer.removeEventListener('scroll', this.onScroll);
        }
    }
    render() {
        return (
            <div className="sticky-wrapper">
                {
                    this.props.children
                }
            </div>
        );
    }
}

export default Sticky;
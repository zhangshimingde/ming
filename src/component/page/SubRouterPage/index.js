import React, { Component } from 'react';

class SubRouterPage extends Component {
    render() {
        return (
            <main>
                subrouter
                <a onClick={() => {
                    this.props.history.push('/open/ProjectManager/PM_Project/Index/0');
                }}>return</a>
            </main>
        );
    }
}

export default SubRouterPage;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EditPage extends Component {
    render() {
        return (
            <main>
                <span>
                    <Link to={`${this.props.pathname}/haha`}>edit</Link>
                    <p>
                        <a onClick={() => {
                            this.props.history.push(`${this.props.pathname}/haha`);
                        }}>haha</a>
                    </p>
                </span>
            </main>
        );
    }
}

export default EditPage;
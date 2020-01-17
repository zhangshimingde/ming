import React from 'react';
import './index.less';

class Dragable extends React.Component {
    componentDidMount() {

    }
    onDragStart = (e) => {
        const { importPath } = this.props;
		e.dataTransfer.setData('text/plain',importPath);
    }
    render() {
        return (
            <div
                draggable="true"
                className="drag-target-item"
                onDragStart={this.onDragStart}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Dragable;
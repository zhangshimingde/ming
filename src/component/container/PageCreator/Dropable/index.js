import React from 'react';
import './index.less';

const activeColor = '#dde7f1';

class Dropable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drop: false,
        };
        this.dropRef = React.createRef();
    }
    componentDidMount() {
        if (this.dropRef) {
            this.dropRef.current.addEventListener('drop', this.onDrop, false);
            this.dropRef.current.addEventListener("dragleave", this.onDragLeave, false);
            this.dropRef.current.addEventListener("dragenter", this.onDragenter, false);
        }
    }
    componentWillUnmount() {
        if (this.dropRef) {
            this.dropRef.current.removeEventListener('drop', this.onDrop);
            this.dropRef.current.removeEventListener('dragleave', this.onDragLeave);
            this.dropRef.current.removeEventListener("dragenter", this.onDragenter);
        }
    }
    onDrop = (e) => {
        e.preventDefault();
        const importPath = e.dataTransfer.getData('text/plain');
        // System.import(importPath).then((m) => {
        // console.log(e);
        // });
        console.log(importPath);
    }
    onDragenter = (e) => {
        e.target.style.background = activeColor;
    }
    onDragLeave = (e) => {
        e.target.style.background = '';
    }
    render() {
        const { renderEmpty } = this.props;
        const { drop } = this.state;
        return (
            <div
                className="drop-container"
                ref={this.dropRef}
            >
                {drop ? this.props.children : renderEmpty()}
            </div>
        );
    }
}

export default Dropable;
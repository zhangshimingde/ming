import React, { Component } from 'react';
import Table from '../Table';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../Table/index.less';

let dragingIndex = -1;

class BodyRow extends Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += ' drop-over-downward';
            }
            if (restProps.index < dragingIndex) {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                {...restProps}
                className={className}
                style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget(
    'row',
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }),
)(
    DragSource(
        'row',
        rowSource,
        (connect) => ({
        connectDragSource: connect.dragSource(),
        }),
    )(BodyRow),
);

class DragSortTable extends React.Component {
    components = {
        body: {
            row: DragableBodyRow,
        },
    }
    moveRow = (dragIndex, hoverIndex) => {
        const { dragable = true } = this.props;
        if (dragable) {
            this.props.onUpdateSort(dragIndex, hoverIndex);
        }
    }
    render() {
        const { dataSource, columns, ...resetProps } = this.props;
        return (
            <Table
                className="drag-sort-table"
                columns={columns}
                dataSource={dataSource}
                components={this.components}
                size="small"
                {...resetProps}
                flCustomRender
                onRow={(record, index) => ({
                    index,
                    moveRow: this.moveRow,
                })}
            />
        );
    }
}

export default DragDropContext(HTML5Backend)(DragSortTable);

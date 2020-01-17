import React, { Component } from 'react'
import Item from './Item';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import './customsort.less';

class customSort extends Component {
  state = {
    showColumns:this.props.showColumns,
    allColumns: this.props.allColumns
  }
  componentDidMount(){
    const {showColumns,allColumns} = this.props;
    this.setState({
      showColumns:showColumns,
      allColumns:allColumns
    })
  }
  render() {
    const { move ,handleSetState} = this.props;
    const {showColumns,allColumns} = this.props;
    return <div className="customsort">
      <div className="title">已选字段</div>
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            opacity: 0.6,
            paddingTop: 16,
            paddingLeft:18
          }}>
            {showColumns.items.map(child => {
              return <Item
                handleSetState={handleSetState}
                showColumns={showColumns}
                allColumns={allColumns}
                key={child.title}
                {...child}
                move={move}
              />
            })}
          </div>
    </div>
  }
}

export default DragDropContext(HTML5Backend)(customSort);

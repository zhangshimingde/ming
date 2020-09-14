import React, { Component } from 'react';
import { Checkbox ,Col,Row } from 'antd';
import './checkbox.less';

class CheckBoxs extends Component {
  constructor(props){
    super(props)
    this.state={
      showColumns:  this.props.showColumns,
      allColumns:  this.props.allColumns
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleData = this.handleData.bind(this);
  }
  componentDidMount(){
    this.handleData();
  }
  handleData(){
    const {showColumns,allColumns} = this.props;
    allColumns.items.map((newitem,i)=>{
      showColumns.items.map((item,i)=>{
        if(newitem.title === item.title){
          newitem.defaultChecked = true
        }
      })
    })
  }
  handleOnChange =(e)=>{
    let {allColumns=[],showColumns=[]}=this.props;
    const {handleSetState,disabled} = this.props;
    let current = [];
    let index = [];
    let length = showColumns.items.length;
    allColumns.items.map((item,i)=>{
      if(item.title === e.target.value){
        item.defaultChecked = !item.defaultChecked;
        current.push(item);
      }
    })
    let dataArr = showColumns.items.filter((item)=>{
      return item.title ===  e.target.value
    })
    showColumns.items.map((item,i)=>{
      if(item.title === e.target.value){
        index.push(i)
      }
    });
    if(dataArr.length === 0){
      if(disabled){
        showColumns.items.splice(length-1,0,{
          ...current[0],
          defaultChecked: true
        })
      }else{
        showColumns.items.push({
          ...current[0],
          defaultChecked: true
        })
      }
      showColumns.bool = !showColumns.bool
    }else{
      showColumns.items.splice(+index[0],1);
      showColumns.bool = !showColumns.bool
    }
    handleSetState(showColumns,allColumns);
  }

  render() {
    const {allColumns =[]}=this.props;
    this.handleData();
    return <div className="checkbox">
      <div >
        <div className="title">可选字段</div>
        <div className="checkboxItems">
          <Row>
            {
              allColumns.items.map((newItem,id)=>{
                return <Col span={6} key={id} style={{marginBottom: 10, fontSize:12,}}> <Checkbox disabled={newItem.title==="操作"||newItem.title==="序号"?true:false}  value={newItem.title} checked={newItem.defaultChecked}  key={id} onChange={this.handleOnChange}>
                  {newItem.title}
                </Checkbox> </Col>
              })
            }
          </Row>
        </div>
        
      </div>
      
        
    </div>
  }
}

export default CheckBoxs

#### 1.Table

|           属性     |说明                         |类型|版本|
|----------------|-------------------------------|-----------------------------|--------------|
|maxShow|表格可见的数据行数量            |number          ||
|fillHeight|是否填充表格高度(当数据较少时使用空白数据撑开表格高度)，默认为false           |boolean           ||
|sizeChange|是否可以切换表格大小，默认为false           |boolean           ||
|pagination.handleUpdate|刷新表格回调函数,设置成函数之后表格右下角会有刷新图标|(pageIndex, pageSize) => {}||
|columnShowSetRef|设置表格列头显示与隐藏的触发控件节点对象，一般是按钮或者图标，具体使用参照示例1|DOM/ReactNode||
|footerExtra|设置表格额外的数据行，可用作表格底部的统计，具体使用参照示例2|array||
|editOnRow|行编辑的配置选项，目前支持InputNumber、Input、Select三种组件编辑模式，具体使用参照示例3|object||
|tableDefaultSize|指定默认的表格大小，选项为big/small，默认为big|string||
|flCustomRender|默认false，当需要自定义table的components属性时设置为true|boolean||
|quickAddRow|快速创建数据行配置项,目前支持Input/Select/DatePicker三种组件编辑,具体使用参数示例4|object||
|lastColumnNoWidth|最后一列是否有width属性，在动态设置表格列的时候可以使用该属性，保证列宽度符合预期(操作列不属于最后一列)默认false|boolean||
|emptyNoScrollBar|当表格没有数据时，是否隐藏滚动条，默认false|boolean||
|bigPadding|是否启用单元格大间距(左右15px,不启用则是8px)，默认false|boolean||
|onValidateFunc|验证所有可编辑单元格的回调函数|function||
|ellipsis|设置表格所有文字超过列宽是否隐藏显示，默认false|boolean|1.8.62|

*说明：

1.兼容antd中的所有属性;

2.操作列如果不加width，默认会设置成109px的宽度；

3.序号列请加上className:  'sort-cell'和sortIndex：true属性；

4.在表格列配置(columns)中可以设置showToolTip是否显示ToolTip，默认为false;

5.针对小数位显示，可以通过配置项进行统一处理，在columns列中配置decimal字段，类型为对象(object)或者数值(number)，如下:
```
decimal: {
            length: 2, // 小数位保留长度
            round: true, // 是否四舍五入
            prefixChar: '', // 金额前缀符号
            thousandBit: false, // 千分位显示
},
```
注：decimal可以直接传递数值，表示length;

*示例

1.columnShowSetRef使用

```
...
 constructor(props) {
     this.columnsSetBtn = React.createRef();
 }
 ...
 render() {
     return (
         ...
         <Button ref={this.columnsSetBtn}>columns set</Button>
         ...
         <Table
            columnShowSetRef={this.columnsSetBtn}
         />
     );
 }
 ...
```

2.footerExtra

```
...
render() {
    return (
        <Table
            footerExtra={[{
                title: '统计1',
                total: 300,
                money: 50000,    
            }, {
                title: '统计2',
                total: 400,
                money: 60000,
            }]}
        />
    );
}
...
```

3.editOnRow

```
...
render() {
    return (
        <Table
            editOnRow={
                toggleEditType: 'cell', // operation|cell | '' 行编辑的三种模式，cell是鼠标移动到组件上点击可编辑，operation是需要点击操作列中的编辑按钮，行才会呈现出编辑的状态，如果为空或者不设置，则可编辑的单元格默认处于编辑状态，验证所有单元格通过onValidateFunc方法
                onEditSave: this.onEditSave, // 行编辑之后保存回调函数，onEditSave入参为编辑行最新的数据
            }
            onValidateFunc={(fuc) => {
                this.validateFunc = fuc; // 这里fuc是table封装的validateFields方法，该方法满足promise范式，验证通过返回所有table的dataSource，不通过则返回null
            }}
        />
    );
}

...
onSubmit() {
    this.validateFunc().then((records) => {
        console.log(records);
        if (records != null) { // 校验通过，更新状态或者调用API
            ...
        }
    });
}

...
```
要使用行编辑，需要设置对应的columns配置：
```
···
const columns = [{
    title: 'name',
    dataIndex: 'name',
    width: 100,
    minWidth: 100,
    resizeble: true, // 表格列是否可以拖拽伸缩，配置了此项之后width不能省略并且不能是百分比，否则没有效果
    editType: 'Input', // 编辑状态下的编辑组件类型
    editable: true, // 该列是否可编辑
    rules: [{ // 编辑保存时的校验规则
        required: true,
        message: '请输入姓名',
    }, {
        title: '性别',
        dataIndex: 'sex',
        width: '150',
        editType: 'Select',
        editable: true,
        options: [{  // 下拉选项
            value: '1',
            text: '男'
        }, {
            value: '2',
            text: '女'
        }],
        render: (text) => {
            return (
                <span>{ text === '1' ? '男' : '女' }</span>
            );
        }
    }]
}
...
```

4.quickAddRow

```
...
 quickAddRow={{
    minWidth: xxxx, // 给新增行设置最小宽度，防止换行
    onAddSave: this.onAddSave, // 保存回调
    addBtnText: '+快速创建', // 新增按钮显示文字，默认'+快速创建'
    columns: [{ // 新增行的表单配置列表，默认取table的columns作为入参，也可以自己定义新增项
        dataIndex: 'title',
        editable: true,
        editType: 'Input',
        placeholder: '请输入标题',
        rules: [{
            required: true, message: '请输入标题',
        }],
    }]
}}
...
```

#### 2.DragSortTable

*说明：
可拖拽实现排序的表格组件，使用该组件，table的列缩放和可编辑功能将失效！！


|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|onUpdateSort(dragIndex, hoverIndex)|排序回调函数            |function          |


DragSortTable新增了onUpdateSort属性，在该函数内对Table的数据源进行重新排序，且新增了immutability-helper三方依赖库，示例如下：

```
import update from 'immutability-helper';
import { DragSortTable } from 'fl-pro';
...
onUpdateSort(dragIndex, hoverIndex) {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];
    this.setState(
        update(this.state, {
            dataSource: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
            },
        }),
    );
}
...

<DragSortTable
    dataSource={this.state.dataSource}
    onUpdateSort={this.onUpdateSort}
>
```
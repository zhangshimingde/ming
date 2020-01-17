## 公共页
完成基本的增删查改、启用禁用、详情弹框功能
可以日后根据公用需求持续添加功能（规范开发模式）
#### CommonPage：公共页组件
- 查询组件
- 选项卡切换
- 表格上面的操作栏（左边操作栏：批量启用、禁用，批量删除，以及可扩展的按钮，右边操作栏：新增按钮以及可扩展的按钮）
- 表格
- 详情弹框（包含逻辑）
- 新增编辑弹框（包含逻辑）
- 其余的特殊弹框（开放）

#### BasePage：被继承的基础函数
```
// 所有函数均可被重写，或者调用
search（err, values）：查询的回调函数，err是否有不通过的文本，values返回查询数据，处理查询的state
showModal(field, record) ：field：弹框显示的字段，record：编辑选择的行数据
hideModal(field): field:弹框隐藏的字段
batchEnable（isEnable）：批量启用、禁用功能，调用enableInfo，isEnable：禁用启用，接收子页面传递的参数
enableInfo（isEnable, ids）：启用禁用功能，isEnable：禁用启用，ids：传入的id（逗号分割）
batchDelete（）：批量删除功能，
deleteInfo（ids）：删除功能，接收子页面传递的参数
confirmModal（type, confirmOption）：确认取消功能，type：success、error、warning、info、confirm，confirmOption；传入的配置项
showDetailModal（record = {}）：展示详情弹框
hideDetailModal（）:隐藏详情弹框
showAddOrEditModal（record = {}）：新增编辑功能，通过传入的this.btnAddPageUrl，判断是页面还是弹框
hideAddOrEditModal：关闭新增编辑功能，通过传入的this.btnReturnUrl，判断是跳转页面还是关闭弹框
btnAddOrEditModalSubmit(err, values):保存新增编辑的数据公用方法
changeTabs（value）：选项卡切换
getData（）：根据search查询的state，获取数据方法
```
通过命令自动生成对应界面
```
npm --registry http://10.0.1.244:8081/repository/npm-group/ install -g fulu-cli
项目里使用
fulu -c 界面名称（小写）
```
生成的界面目录
```
less文件夹：存放less文件
AddForm.js：新增编辑的页面（已处理公用逻辑）
addOrEditFormConfig.js：新增编辑表单的配置文件
SpecialModal.js：自定义弹框
index.js：页面文件
searchFormConfig.js：查询表单的配置文件
ShowAddOrEditModal.js：新增编辑的弹框（已处理公用逻辑）
ShowDetailModal.js:详情弹框（处理数据加载的公用逻辑）
```
#### UsePage.js，开发者需要关注的页面（通过this传递配置）
- this变量的解释

```
constructor(props) {
        super(props);
        this.namespace = 'usePage'; // 默认加载的命名空间，对应页面名称以及models
        // table配置项
        this.tableConfig = {
            scrollWidth: 1200, // table表格的宽度，超过出现滚动条
            // scrollHeight: 400, // table表格的高度，超过出现滚动条
            rowSelectionType: 'checkbox', // 表格单选多选展示
        };
        // 查询form的配置项
        this.searchFormConfig = {
            showCount: 5 // 查询表单默认展示个数
        }
        // 面包屑
        this.pageBreadCrumbs = '监控列表';
        // 详情页弹框配置项（传入组件）
        this.detailModal = ShowDetailModal;
        // 新增编辑弹框配置项（传入组件）
        this.addOrEditModal = ShowAddOrEditModal;
        // 跳转到新增页面（传入路由，如果传入则是跳转页面不是弹框）
        this.btnAddPageUrl = '/usePage/usePageAddForm';
        // 返回到当前页面（配合新增使用）
        this.btnReturnUrl = '/usePage';
        // 编辑、删除等操作的的默认id
        this.guidId = 'id';
        this.guidIds = 'ids';
        // 操作栏
        this.controlBar = {
            // 左边的操作按钮
            leftControlBar: {
                // 批量删除
                batchDeleteConf: {
                    title: '删除确认',
                    content: '确定要删除所选数据吗？',
                },
                // 批量启用禁用
                batchEnableConf: {
                    title: '禁用确认',
                    content: '确定要禁用11所选数据吗？',
                    // 启用禁用的字段是什么
                    enableField: 'isEnable',
                },
                // // 需要添加的操作栏
                // addLeftBtnArr: [{
                //     text: '展示特殊弹框', // 按钮的文字
                //     needDisabled: false, // 是否要根据表格选择的checkbox启用禁用
                //     onClick: this.specialModal // 回调的点击事件，回调this
                // },]
            },
            // 右边的操作按钮
            rightControlBar: {
                // 新增
                btnAddText: '新增数据',
                // 需要添加的操作栏
                addRightBtnArr: [{
                    text: '展示特殊弹框22',  // 按钮的文字 
                    onClick: this.showRightModal // 回调的点击事件，回调this
                }]
            }
        };
        // 是否展示tabs
        this.showTabsConfig = {
            name: 'orderStatus',
            list: [{
                key: '1',
                tab: '选项1'
            }, {
                key: '2',
                tab: '选项2'
            }, {
                key: '3',
                tab: '选项3'
            }, {
                key: '4',
                tab: '选项4'
            }]
        };

    }
```

- 函数

```
// 处理初始化的数据
initManage():处理tabs选项卡如果存在给查询的条件tabs选项卡的默认值，同时设置查询组件的配置文件，设置表单的columns字段
getSpinningLoading():传入spin加载的loading状态
renderTableTopContent():返回table上方的html
renderTableTopContent():返回table下方的html
```
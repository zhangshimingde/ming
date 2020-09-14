# 福禄管家公共组件库

## <a href="./doc/Guide.md" style="font-size:18px;">组件开发规范指南</a>

## <a href="https://github.com/lanpangzi-zkg/docs/blob/master/articles/web_optimization.md" style="font-size:18px;">项目优化指南</a>

## <a href="./doc/cache-manage.md" style="font-size:18px;">缓存版本控制指南</a>

## 1.版本发布信息

|版本号  |日期   |说明|
|----------------|-------------------------------|-----------------------------|
|V1.8.71|2020/08/31|1.SearchForm组件维护升级|
|V1.8.70|2020/08/21|1.修复埋点组件报错问题<br>2.修复商户侧应用在按需引入fulu组件时Page403、Page404等页面丢失问题|
|V1.8.69|2020/08/13|1.埋点组件新增对商户侧应用的支持|
|V1.8.68|2020/08/10|1.新增错误边界处理，捕获渲染过程的异常问题，避免白屏|
|V1.8.67|2020/07/23|1.切换商户的列表的逻辑处理<br>2.新增SimpleTable组件|
|V1.8.66|2020/07/09|1.添加BraftEditor富文本编辑器，替换WangEditor组件<br>2.修复RangePicker兼容性问题|
|V1.8.65|2020/07/03|1.修复埋点组件获取12小时制时间错误的问题<br>2.新增组件库在单独引用模式下的导出<br>3.新增项目优化指南文档|
|V1.8.64|2020/06/12|1.由于兼容性问题，自定义RangePicker组件暂时隐藏，组件库目前导出的是antd的RangePicker组件，不影响项目的使用|
|V1.8.63|2020/05/13|1.运营测添加埋点功能<br>2.新增UI规范样式表<br>3.商户和运营测组件支持标签导入的使用方式|
|V1.8.62|2020/04/15|1.UI整体样式调整<br>2.新增Confirm组件<br>3.新增Copy复制组件<br>4.form添加响应式支持<br>5.组件支持通过标签导入使用(商户侧应用)<br>6.新增Popover组件<br>7.table新增ellipsis属性<br>8.运营侧添加前端埋点收集，具体查看RouteWithLayout组件说明|
|V1.8.61|2020/03/06|1.修复运营侧接口504状态下跳转空白页面的问题|
|V1.8.60|2020/01/10|1.优化商户测右上角展示<br>2.ExportButton新增linkTag属性，支持a标签渲染|
|V1.8.59|2019/12/24|1.调整运营测左侧菜单图标样式|
|V1.8.58|2019/12/13|1.新增WaveButton和ScrollNumber组件<br>2.修复运营测url拼接过长的问题<br>3.更新公共样式表(fulu.min.v1.4.css)|
|V1.8.57|2019/11/29|1.TradeValidateWrap组件env参数支持数组类型<br>2.修改用户中心链接地址|
|V1.8.56|2019/11/25|1.调整组件说明文档目录与结构<br>2.TradeValidateWrap组件新增phoneNo属性|
|V1.8.55|2019/11/22|1.修复运营测应用菜单收缩文字被裁切问题<br>2.商户侧菜单新增hiddenMenus属性，隐藏菜单显示|
|V1.8.54|2019/11/11|1.修复运营测应用菜单排序失效问题<br>2.优化商户侧头部未读信息展示<br>3.表格新增默认编辑模式|
|V1.8.53|2019/10/31|1.新增交易身份验证组件TradeValidateWrap<br>2.商户侧头部添加未读消息提示|
|V1.8.52|2019/10/11|修改菜单图标显示路径，兼容http和https站点|
|V1.8.51|2019/10/10|1.商户侧与运营测菜单图标支持自定义上传与配置，<br>2.新增table在页码切换时重置右侧滚动条位置的功能|
|V1.8.50|2019/09/06|1.商户侧Flayout组件新增initPath属性，<br>2.商户侧新增debugger模式，在url查询参数添加debug=1|
|V1.8.49|2019/08/23|1.修复table样式问题，table新增emptyNoScrollBar属性<br>2.商户侧商户管理区功能调整|
|V1.8.48|2019/08/14|1.新增导出文件按钮 |
|V1.8.47|2019/08/05|1.调整table默认行高；table新增添加数据行功能；修复DragSortTable失效问题<br>2.商户侧菜单新增defaultOpenMenu属性；<br>3.cdn样式表更新v1.3版本 |
|V1.8.46|2019/07/29|1.table新增flCustomRender(boolean)属性，默认false，当需要自定义table的components属性时设置为true，同时修复table滚动样式问题；<br>2.商户侧菜单图标大小调整为18*18px； |

## 2.组件列表


### 2.1 框架类

<ul>
    <li>
        <a href="./doc/RouteWithLayout.md" style="font-size:18px;">RouteWithLayout(运营测框架)</a>
    </li>
    <li>
        <a href="./doc/Flayout.md" style="font-size:18px;">Flayout(商户测框架)</a>
    </li>
</ul>

### 2.2 动画类

<ul>
    <li>
        <a href="./doc/WaveButton.md" style="font-size:18px;">WaveButton</a>
    </li>
     <li>
        <a href="./doc/ScrollNumber.md" style="font-size:18px;">ScrollNumber(数字滚动切换)</a>
    </li>
     <li>
        <a href="./doc/QueueAnimFulu.md" style="font-size:18px;">QueueAnimFulu</a>
    </li>
</ul>

### 2.3 复合组件类

<ul>
    <li>
        <a href="./doc/Form.md" style="font-size:18px;">Form</a>
    </li>
    <li>
        <a href="./doc/SearchForm.md" style="font-size:18px;">SearchForm</a>
    </li>
    <li>
        <a href="./doc/AddOrEditForm.md" style="font-size:18px;">AddOrEditForm</a>
    </li>
    <li>
        <a href="./doc/BraftEditor.md" style="font-size:18px;">BraftEditor</a>
    </li>
    <li>
        <a href="./doc/CommnPage.md" style="font-size:18px;">公共页</a>
    </li>
</ul>

### 2.4 其他

<ul>
    <li>
        <a href="./doc/Table.md" style="font-size:18px;">Table</a>
    </li>
     <li>
        <a href="./doc/SimpleTable.md" style="font-size:18px;">SimpleTable</a>
    </li>
     <li>
        <a href="./doc/TradeValidateWrap.md" style="font-size:18px;">TradeValidateWrap(交易验证)</a>
    </li>
    <li>
        <a href="./doc/ExportButton.md" style="font-size:18px;">ExportButton</a>
    </li>
    <li>
        <a href="./doc/BreadCrumb.md" style="font-size:18px;">BreadCrumb</a>
    </li>
    <li>
        <a href="./doc/Confirm.md" style="font-size:18px;">Confirm</a>
    </li>
     <li>
        <a href="./doc/Copy.md" style="font-size:18px;">Copy</a>
    </li>
    <li>
        <a href="./doc/Popover.md" style="font-size:18px;">Popover</a>
    </li>
</ul>


## 3.组件接入说明

### 从1.8.63版本开始，组件库支持通过npm和标签引入两种接入方式，通过标签引入的方式方便测试，不建议在生产环境使用，后续发布的新版本也将延续两种接入方式的形式；

### 两种组件接入方式都需要引入规范样式表，具体引入方式如下：

页面模板加入样式:
```
<link rel="stylesheet" type="text/css" href="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/css/fl-ui.min.css">
```
*.如果加入规范样式表对现有系统产生了较大的影响，可以暂时不引入该样式表

3.1 npm包安装与更新

npm --registry http://10.0.1.244:8081/repository/npm-group/ install fl-pro --save (初次安装)

npm --registry http://10.0.1.244:8081/repository/npm-group/ update fl-pro (更新版本)


3.2 标签引入

*1.) xxx-frame.min.css为组件库样式表，商户侧和运营测引用文件不一样，请注意如下示例

*2.) fl.base.dll.js和fl.vender.dll.js为公共依赖库，在页面中都需要引入

*3.) 商户侧和运营测的框架js文件的加入位置需要位于项目中加载configs.js标签之后

*4.) 项目中自动打包加入的脚本标签位于框架js脚本后面

*5.) x.xx.xx为组件版本号，目前支持1.8.63


3.2.1 商户侧
```
<link rel="stylesheet" type="text/css" href="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/css/merchant-frame.min.css">
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/fl.base.dll.js"></script>
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/fl.vender.dll.js"></script>

<script src="/resources/js/configs.js"></script> // 这个是各自项目中的configs.js加载脚本，框架js脚本需要位于configs.js脚本之后
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/merchant-frame.min.js"></script>
// 项目构建的脚本文件
```

3.2.2 运营侧
```
<link rel="stylesheet" type="text/css" href="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/css/manage-frame.min.css">
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/fl.base.dll.js"></script>
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/fl.vender.dll.js"></script>

<script src="/resources/js/configs.js"></script> // 这个是各自项目中的configs.js加载脚本，框架js脚本需要位于configs.js脚本之后
<script type="text/javascript" src="https://fulu-common-util.oss-cn-hangzhou.aliyuncs.com/x.xx.xx/js/manage-frame.min.js"></script>
// 项目构建的脚本文件
```

### 运营侧组件引用修改(标签引入方式需要修改)
```
// 修改前
import RouteWithLayout, { FLayout } from 'fl-pro';

// 修改后
import { RouteWithLayout, FLayout } from 'fl-pro';
```

3.2.3 修改webpack配置

```
externals: {
    'fl-pro': 'flPro',
},
```

3.3 公用函数

npm --registry http://10.0.1.244:8081/repository/npm-group/ install fulu-method --save (初次安装)

npm --registry http://10.0.1.244:8081/repository/npm-group/ update fulu-method (更新版本)

## 4.旧项目改造注意事项

1.修改webpack中的svg插件配置

...

{
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,

    use: [{

            loader: 'babel-loader',

        }, {

            loader: '@svgr/webpack',

            options: {

                babel: false,

                icon: true,

            },
        },
    ],
}

...

2.依赖包升级

react 、 react-dom 、 antd包版本请升级到新版本


3.svg图标显示

对于旧项目中svg图标显示不出来的问题，需要对项目中封装的Icon组件进行改造，不要直接使用svg标签来进行显示，而是采用antd提供的Icon图标，也能满足自定义显示需求，具体整改如下：

```
import { Icon } from 'antd';
import svgImage from '../images/svgImage.svg';
...

return <Icon component={svgImage} />;
```

4.其他

项目中如果采用dll打包，请重新编译

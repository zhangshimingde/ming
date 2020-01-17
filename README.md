# 福禄管家公共组件库

## 1.版本发布信息

|版本号  |日期   |说明|
|----------------|-------------------------------|-----------------------------|
|V1.8.60|2020/01/10|优化商户测右上角展示|
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
        <a href="./doc/SearchForm.md" style="font-size:18px;">SearchForm</a>
    </li>
    <li>
        <a href="./doc/AddOrEditForm.md" style="font-size:18px;">AddOrEditForm</a>
    </li>
    <li>
        <a href="./doc/WangEditor.md" style="font-size:18px;">富文本编辑</a>
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
        <a href="./doc/TradeValidateWrap.md" style="font-size:18px;">TradeValidateWrap(交易验证)</a>
    </li>
    <li>
        <a href="./doc/ExportButton.md" style="font-size:18px;">ExportButton</a>
    </li>
    <li>
        <a href="./doc/BreadCrumb.md" style="font-size:18px;">BreadCrumb</a>
    </li>
</ul>


## 3.使用说明

1.公共库

npm --registry http://10.0.1.244:8081/repository/npm-group/ install fl-pro --save (初次安装)

npm --registry http://10.0.1.244:8081/repository/npm-group/ update fl-pro (更新版本)


2.cli工具(可以生成项目脚手架，自动生成代码)

npm --registry http://10.0.1.244:8081/repository/npm-group/ install -g fulu-cli (初次安装)

npm --registry http://10.0.1.244:8081/repository/npm-group/ update fulu-cli (更新版本)


命令行说明

fulu -c PageName // 创建PageName页面及其modal,service,完成路由注册

fulu ProjectName // 生成ProjectName项目脚手架

3.公用函数
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

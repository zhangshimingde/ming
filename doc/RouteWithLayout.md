#### RouteWithLayout

1.model注册

import { PublicLayout } from 'fl-pro';

app.model(PublicLayout);


2.router配置

import RouteWithLayout, { FLayout } from 'fl-pro';

...

 const PublicLayout = FLayout(app);

 or

 const PublicLayout = FLayout(app, ContentPage); // 可以配置欢迎首页

...

*必须配置的路由项:

```
<RouteWithLayout layout={PublicLayout} path="/settings" />
<RouteWithLayout layout={PublicLayout} path="/info" />
<RouteWithLayout layout={PublicLayout} path="/iframe" />
<RouteWithLayout layout={PublicLayout} path="/fav" />
<Route exact path="/403" component={PageForbidden} />
<Route exact path="/404" component={PageNotFound} />
<Route exact path="/500" component={PageServerError} />
<Route exact path="/error" component={PageNetworkError} />
<RouteWithLayout exact layout={PublicLayout} path="/" />
```

3.组件配置属性

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|expandMenu|默认情况下是否展开所有应用的菜单，默认true            |boolean          |


4.业务组件获取的属性(以下属性通过props传递至页面组件)

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|isShow|当前tab页是否可见          |boolean          |
|menuList|当前应用的所有菜单列表          |array        |
|tabMenu|当前tab页对应的菜单对象          |object          |


5.前端埋点配置说明

从组件1.8.62版本开始，运营侧提供埋点功能，可以收集菜单点击、目标元素点击事件及异常事件，支持自定义配置；

5.1 埋点功能配置

需要开启埋点功能，首先在项目入口文件(index.js)中加入window.monitorOpen = true，根据需要可以定义埋点配置信息
window.monitorConfig；
```
const history = createHistory();
......

app.start('#app');

window.monitorOpen = true; // 开启埋点
window.monitorConfig = { // 不必填
    selectors: ['.ant-btn-primary', 'button'], // 自定义的选择器，命中这些选择器的节点数据会上报
    menuVisit: true, // 是否收集菜单点击事件，默认为true
    errorCatch: true, // 是否收集异常信息，包括接口、资源加载、js运行异常，默认为true
};
```

*注意事项：需要组件自动收集数据的目标元素，需要具备如下属性:

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|data-mid|定义元素上报的id属性，必填          |string          |
|data-minfo|上报的补充信息，可自定义内容，不必填          |string        |

示例如下:
```
<Button data-mid="a" data-minfo="查询接口aaaa/bbbb">button</Button>  
```

5.2 自定义上报埋点数据

开发者可以自己封装数据，然后调用window.sendWebData()方法上报数据，sendWebData入参如下：

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|actionTime|事件发生时间，时间格式字符串（YYYY-MM-DD hh:mm:ss）          |string          |
|info|上报的数据，可自定义内容          |string        |
|itemId|元素ID          |string          |

5.3 configs.js字段配置

需要在configs.js中加入monitorHost字段，表示埋点请求接口地址（见下面地址列表），形如:

```
 var configs = {
        ......
        host: {
          passport: {
           ......
          },
          monitorHost : 'xx/xxxx/xxxxxx',
          ......
        }
      };
```

*提示：monitorHost地址http协议需要与接入应用的http协议保持一致；
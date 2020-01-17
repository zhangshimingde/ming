#### Flayout(原fulu组件)

fulu组件目前合并到了fl-pro库中，使用方法如下：

...

import { fulu as Flayout } from 'fl-pro';

...

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|hiddenMenus|需要隐藏的菜单路由集合，在这里配置的菜单不会显示在左侧菜单中(菜单不能包含子菜单，且路由不能为空)|array|
|initPath|默认打开制定路径的路由，该参数只在初始访问路径为根路径(/)的时候才有效|string|
|defaultOpenMenu|默认展开的菜单名数组，如['订单管理', '商品管理']|array|
|openAllMenu|是否默认展开所有菜单，默认为false            |boolean          |
|autoFoldUnclickMenu|是否自动折叠未点击的一级菜单，设置为true，只有当前选中的一级菜单才会展开，默认为false |boolean          |
|autoOpenFirstMenu|点击一级菜单时是否默认打开该一级菜单下的第一个二级菜单，默认为false           |boolean           |
|menuBradgeLoop|菜单显示额外数据的查询接口是否轮询，默认为true|boolean|
|menuBradges|菜单显示额外数据的映射字典，同时可以通过onSetPollingTime设置轮询接口的间隔时间，目前仅支持客服系统和pop系统          |object           |
|menuBradgeUrl|查询菜单额外数据的接口地址，请求方式get，没有请求参数，这里请指定完整的接口地址(不能是相对地址)，且接口返回结构：{ code: '0', data: { xx: 20 } }        |string           |
|JoinTeamZone|协作者自定义渲染视图|ReactNode|


其他说明：

1.在网络请求公共类(request/axios)中，统一引用错误处理方法(handleErrNavCallBack在遇到401或者403错误时会跳转页面，handleErrCallBack只是消息提示)：


import { handleErrCallBack, handleErrNavCallBack } from 'fl-pro';

...

instance.interceptors.response.use(function (response) {

    ......

}, handleErrCallBack | handleErrNavCallBack);

...


2.商户控制台获取商户信息和余额调整

fulu组件以前的版本将Finance和merchantInfo数据直接挂在window对象上，导致子组件不能实时获取最新数据，现将数据通过Context传递，从而解决该问题(Finance修改成financeInfo)，onSetPollingTime用来设置菜单查询接口的轮询间隔时间，默认3000ms：

...

render() {

    const FuluContext = window.FuluContext;

    return (<FuluContext.Consumer>

        {

            ({ financeInfo, merchantInfo, merchantList, onSetPollingTime }) => {

                return (......);

            }

        }

    </FuluContext.Consumer>);

}

...


3.商户管理区自定义组件(CustomManageZone)

目前支持商户管理区自定义功能，具体用法如下：

```
···
const RouterWrapper = ({ history, app }) => {
    const CustomManageZone = dynamic({ // 自定义商户区域管理组件
        app,
        models:() => [
            import('./CustomManageZoneModel')
        ],
        component: () => { return import('./CustomManageZone'); },
    });
    return (
        <ConnectedRouter history={history}>
            <Flayout appName="福禄商户控制台" config={config} CustomManageZone={CustomManageZone}>
                <LocaleProvider locale={zh_CN}>
                    <Switch>
                        {/* 403 */}
                        <Route exact path="/403" component={Page403} msg={window.errMsg} />
                    </Switch>
                    ......
                </LocaleProvider>
            </Flayout>
        </ConnectedRouter>
    );
};
...
```

此外，CustomManageZone还会接收toEnterApp、merchantList、fetchMerchantList三个属性值：

1.toEnterApp

类型：function(merchant)

说明：点击进入具体商户应用的跳转方法，入参为商户信息对象


2.merchantList

类型：array

说明：商户应用列表

3.fetchMerchantList


类型：function

说明：查询商户应用列表
### BreadCrumb(面包屑)
- 列表页面的面包屑功能

```
 <BreadCrumb history={history} breadCrumbText={'/首页/内部协查工单/协查工单'} breadCrumbList={[
    {
        name: '首页',
        link: true,
        path: '/'
    },
    {
        name: '内部协查工单',
        link: false,
        path: ''
    },
    {
        name: '协查工单',
        link: false,
        path: '/handleworkorder'
    }
]} />
```

参数 | 说明 | 类型
---|---|---
history | 传入列表的props.history,获取当前页面的路由 | Object
link | true:有链接，false：无链接（breadCrumbText会通过link进行判断） | Boolean
path | 面包屑路由 | String
breadCrumbList | 传入页面路由以及名称，传入字段为name,link,path，如果传入该字段则不读取breadCrumbText | Array
breadCrumbText | 对规则有要求，名称和路由必须要做到一一对应，传入面包屑的名称，根据路由自动匹配(/首页/内部协查工单/协查工单) (/home/innerPage/innerInnerPage) | String

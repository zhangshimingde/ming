### QueueAnimFulu(动画组件)

- 包裹的组件会添加动画加载的效果,内部组件使用key才能触发动画效果

```
<QueueAnimFulu type="bottom">
    <div key="a">Queue Demo</div>
    <div key="b">Queue Demo</div>
    <div key="c">Queue Demo</div>
    <div key="d">Queue Demo</div>
</QueueAnimFulu>
```
参数 | 说明 | 类型
---|---|---
type | 传入想要组件加载动画的方向(top、bottom、left、right),默认bottom | String
#### TradeValidateWrap

交易验证容器组件，用于返回用户在安全中心配置的交易类型(组件不负责渲染交易验证界面，只返回交易验证类型和必要的异常信息):


|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|env|各应用对应的prod/it/pre三个环境的地址对象，prod表示项目正式环境地址，三个参数都支持string和array类型(路径将严格匹配，如果是string，则会忽略http协议的差异)，array类型满足一个环境不同站点的场景，地址示例格式http(s)://xxx.xx.x，必填            |object          |
|phoneNo|查询指定电话号码用户的交易配置类型,，如果不传此参数，则默认查询当前用户的交易类型，不必填            |string          |
|block|加载状态时组件宽高是否与父容器一致，设置此属性后加载动画一般会处于居中的位置(自定义加载动画位置则不一定)，默认false，不必填            |boolean          |
|renderSpin|加载动画自定义渲染函数，不必填            |function          |

```
    <TradeValidateWrap env={{ prod: '...', it: '...', pre: '...' }}>
        {({ validateType, error }) => {
            // validateType = null, 查询失败，具体异常信息查看error入参
            // validateType = 0, 短信验证
            // validateType = 1, 电子令牌验证
            // error 异常信息
            return (...); // 自定义渲染组件
        }}
    </TradeValidateWrap>
``` 
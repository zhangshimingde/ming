#### ScrollNumber

数字滚动组件

<img src="./scroll-number.gif">


|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|height|组件高度，必填            |string|number          |
|value|显示的值，必填           |string|number           |
|delay|动画延迟时间，默认0，不必填           |number           |
|duration|动画持续时间，默认1000ms，不必填|number|
|initalValue|初始值，不必填           |string|number           |

## 注意事项：delay+duration的时间总和要小于等于value的更新时间间隔，否则将会有数据显示丢失的情况；

#### DivideScrollNumber

属性同上，该组件可以将传入的字符拆分，单独滚动每个字符

<img src="./divide-scroll-number.gif">

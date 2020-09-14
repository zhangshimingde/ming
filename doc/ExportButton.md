#### ExportButton

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|url|导出接口的完整地址，必填            |string          |
|merchantId|商户id，如果没有传递且本地localStorage有值，会在请求中加入此参数，不必填           |string           |
|params|请求参数，必填           |object           |
|fileName|导出的文件名称，如果不传递则默认按照当前时间戳生成文件名，不必填|string|
|fileType|文件类型，默认为xlsx，不必填           |string           |
|method|默认POST，不必填|string|
|linkTag|是否a标签渲染，默认false，采用Button渲染|boolean|
|beforeClick|执行下载前的回调函数，如果返回false，则不执行下载，返回true才继续执行，该回调函数不支持异步，不必填|function|
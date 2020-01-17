#### ExportButton

|           属性     |说明                         |类型|
|----------------|-------------------------------|-----------------------------|
|url|导出接口的完整地址，必填            |string          |
|merchantId|商户id，根据后端校验规则传递，不必填           |string           |
|params|请求参数，必填           |object           |
|fileName|导出的文件名称，如果不传递则默认按照当前时间戳生成文件名，不必填|string|
|fileType|文件类型，默认为xlsx，不必填           |string           |
|method|默认POST，不必填|string|
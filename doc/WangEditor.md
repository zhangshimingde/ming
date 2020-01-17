### 12.富文本编辑

- 实现富文本编辑的功能

```
<WangEditor
    width={800}
    changeEditorContent={this.changeEditorContent}
    editorContent={editorContent}
    uploadImgServer={'http://it.console.service.api-admin.suuyuu.cn/api/FileUpload/Upload'}
    token={'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImNlMjVhNzI2LTA4NzYtNDMxOC05ZWJiLWI0NjYxMGUxOGU1NSIsIm9wZW5faWQiOiIyRDgwOTkwQjM3QjRCNTVCQTMxNkIyOTM0QjM5N0I2MyIsIm5hbWUiOiI4NzcwIiwibmlja25hbWUiOiLojYbpgKLmo64iLCJwaG9uZV9udW1iZXIiOiIxMzYxODYyNzE4OSIsImVtYWlsIjoiNDQxMDc2NTA2QHFxLmNvbSIsInJvbGUiOiJVc2VyIiwibG9naW5faXAiOiIxMTMuNTcuMTE4LjU5IiwibG9naW5fYWRkcmVzcyI6Iua5luWMl-ecgeatpuaxieW4giIsImxhc3RfbG9naW5faXAiOiIxMTMuNTcuMTE4LjU5IiwibGFzdF9sb2dpbl9hZGRyZXNzIjoi5rmW5YyX55yB5q2m5rGJ5biCIiwiYmluZGluZ19zdGF0dXMiOiIwIiwidXJuOm9hdXRoOnNjb3BlIjoiZ2V0X3VzZXJfaW5mbyIsImNsaWVudF9pZCI6IjEwMDAwMTAxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoxNTMxIiwiYXVkIjoiYXBpIiwiZXhwIjoxNTY2Mzc1MzI3LCJuYmYiOjE1NjYzNjgxMjZ9.a7wILtWLepjmO4Y_WTmHYwkLM7IUbToe60Dx_DyTZ8I'}
    merchantId={'e2256135-c010-06b8-d802-39eca803ed28'}
    menus={[
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
    ]}
/>
```

```
menus：[
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ]
```

参数 | 说明 | 类型
---|---|---
width | 设置组件宽度 | String，Number
changeEditorContent | 改变富文本编辑的方法的回调事件 | function
editorContent | 默认加载的数据 | String
uploadImgServer | 上传图片的url | String
token | 用户token,不传默认使用`Bearer localStorage.getItem('access_token')`传递方式 | String
merchantId | 商户Id,不传默认使用`localStorage.getItem('MerchantId') `传递方式 | String
menus | 自定义富文本编辑功能，根据传入的数据进行展示 | Array
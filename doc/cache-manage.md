## 缓存版本控制指南

### 缓存问题
目前前端项目编译输出的静态资源文件都是通过hash来命名，但是会有多个版本发布后文件名还是一样的问题，导致最新的版本需要强制刷新浏览器才会显示最新的效果；

### 1.添加版本号

#### 1.1) 修改webpack配置

```
// 导入package.json的版本
const packageJson = require('./package.json');
const buildVersion = packageJson.version;
```

```
 output: {
    path: join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'resources/js/[name]-[hash:10]-'+ buildVersion +'.js', // js文件名添加buildVersion
    chunkFilename: 'resources/js/[name]-[contenthash:10]-'+ buildVersion +'.js', // js文件名添加buildVersion
  },
```

```
 ...(!DEBUG ? [new MiniCssExtractPlugin({
    filename: 'resources/css/[name]-[contenthash:10]-'+buildVersion+'.css', // css文件名添加buildVersion
    chunkFilename: 'resources/css/[name]-[contenthash:10]-'+buildVersion+'.css', // css文件名添加buildVersion
})] : []),
```

```
new htmlWebpackPlugin({
    ...
    version: buildVersion, // html-webpack-plugin插件的options配置项添加version参数
    ...
}),
```

```
<script type="text/javascript" src="/resources/js/configs.js?v=<%= htmlWebpackPlugin.options.version %>"></script> // 模板页面手动引入的资源加'?v=xxx'的后缀
```

### 2.添加自动更新版本号的脚本

#### 2.1) 添加update-version.js到项目根目录

* 文件路径: http://10.0.0.40:10080/ich_ued/fulu-pro/blob/master/update-version.js

#### 2.2) 新增脚本命令
```
"scripts": {
    ...
    "update-version": "node update-version.js",  // 新增update-version命令
    "build": "npm run update-version && npm run release" // 新增build命令，或者 "release": "npm run update-version cross-env electronMode=production..."
    ...
}
```
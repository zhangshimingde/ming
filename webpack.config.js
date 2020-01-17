const path = require('path');
const ip = require('ip');
const process = require('process');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const DashboardPlugin = require('webpack-dashboard/plugin');

const npmScriptName = process.env.npm_lifecycle_event;

// svg 目录
const svgDirs = [
  require.resolve('antd').replace(/warn\.js$/, ''),
  path.join(__dirname, 'src'),
];

const configs = {
  entry: {
    // index: ['babel-polyfill', './src/index.dev.js'],
    index: npmScriptName === 'start-fulu' ? './src/fuluDev/app.jsx' : npmScriptName === 'start-demo' ? './src/index.demo.js' : './src/index.dev.js',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: "./lib", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true,
    hot: true,
    host: ip.address(),
    port: 10010,
  },
  watchOptions: {
    // aggregateTimeout: 300,
    poll: 1000,
    // ignored: /node_modules/
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader', // translates CSS into CommonJS
      }, {
        loader: 'less-loader', // compiles Less to CSS
        options: {
          modifyVars: {
            "@primary-color":"#00CC66"
            // 'link-color': '#3270FF',
            // 'border-radius-base': '2px',
            // 'success-color': '#33B42B',
            // 'warning-color': '#F9AB15', // 警告色
            // 'error-color': '#EE4010', // 错误色
            // or
            // 'hack': `true; @import "your-less-file-path.less";`, // Override with less file
          },
          javascriptEnabled: true,
        },
      }],
    }, {
      test: /\.js(x)?$/,
      exclude: /(node_modules)/,
      use: ['babel-loader', 'eslint-loader'],
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true,
          },
        },
      ],
      include: svgDirs,
    }, {
      test: /\.(jpeg|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          }
        }
      ]
    }, {
      test: /\.png$/,
      use: [
        'file-loader?name=[hash].[ext]'
      ]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)\w*/,
      include: path.resolve(__dirname, "src/assets/fonts"),
      loader: 'url-loader?limit=1000000'
    }],
  },
  plugins: [
    new CleanWebpackPlugin(['lib']),
    new HtmlWebpackPlugin({
      title: 'fulu-pro',
      filename: './index.html',
      template: './src/template/index.html',
    }),
    new ExtractTextPlugin({ // 抽取css文件
      filename: "./css/fulu.min.css",
      allChunks: true,
    }),
    new SpritesmithPlugin({ // 生成雪碧图插件
      src: {
        cwd: path.join(__dirname, 'src/assets/sprite'), // 资源文件目录
        glob: '*.png',  // 匹配图片格式
      },
      target: {
        image: path.join(__dirname, 'src/assets', 'sprite.png'), // 生成的雪碧图路径
        css: path.join(__dirname, 'src/assets', 'sprite.less'), // 生成的css/less
      },
      apiOptions: {
        cssImageRef: './sprite.png', // css文件中引用雪碧图的相对位置路径配置
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new SvgSpriteLoaderPlugin(), // svg资源生成雪碧图插件
    new DashboardPlugin(),

  ],
  resolve: {
    // 省略后缀
    extensions: ['.jsx', '.js'],
    modules: ["node_modules", "assets"],
    alias: { // 通过别名来把原来导入路径映射成一个新的导入路径
      component: path.resolve(__dirname, 'src/component'),
    }
  },
};

if (npmScriptName === 'start-fulu') {
  configs.plugins.push(new webpack.DefinePlugin({
    '__DEV__': true
  }));
}

module.exports = configs;
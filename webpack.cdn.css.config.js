const path = require('path');
const os = require('os');
const loadJsonFile = require('load-json-file');
const AssetsPlugin = require('assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const HappyPack = require('happypack');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const { version } = loadJsonFile.sync(path.resolve(__dirname, 'package.json'));
const cdnDir = path.join(__dirname, 'cdn', version);

const configs = {
    entry: [
        path.join(__dirname, 'src/cdn.css.entry.js'),
    ],
    output: {
        path: cdnDir,
        publicPath: '../',
        filename: 'js/fl-ul.min.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'happypack/loader?id=css',
                ],
            }, {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'happypack/loader?id=less',
                ],
            }, {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name]-[hash:10].[ext]',
                        limit: 4096,
                        outputPath: 'images/',
                    },
                }],
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'babel-loader',
                }, {
                    loader: '@svgr/webpack',
                }],
            }],
    },
    plugins: [
        new LodashModuleReplacementPlugin({
            collections: true,
            paths: true,
        }),
        new AssetsPlugin({
            path: path.join(__dirname, 'build'),
            includeManifest: path.join(__dirname, 'build/manifest'),
        }),
        new HappyPack({
            id: 'svg',
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'babel-loader',
            }, {
                loader: '@svgr/webpack',
                options: {
                    babel: false,
                    icon: true,
                },
            }],
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            loaders: ['css-loader', 'postcss-loader'],
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            loaders: ['css-loader', 'postcss-loader', {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                },
            }],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/fl-ui.min.css',
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.join(__dirname, 'src/assets/sprite'),
                glob: '*.png',
            },
            target: {
                image: path.join(__dirname, 'build/sprite.png'),
                css: path.join(__dirname, 'build/sprite.less'),
            },
            apiOptions: {
                cssImageRef: '~sprite.png',
            },
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'build'),
            path.join(__dirname, 'node_modules'),
        ],
    },
};

module.exports = configs;

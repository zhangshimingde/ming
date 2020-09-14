const path = require('path');
const os = require('os');
const webpack = require('webpack');
const loadJsonFile = require('load-json-file');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const HappyPack = require('happypack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const manifestVenderDll = require('./src/assets/js/fl_vender-manifest.json');
const manifestBaseDll = require('./src/assets/js/fl_base-manifest.json');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const { version } = loadJsonFile.sync(path.resolve(__dirname, 'package.json'));
const cdnDir = path.join(__dirname, 'cdn', version);

const [,, ...argvArr] = process.argv;

const cdnTypeArgv = argvArr.find((str) => {
    return str.indexOf('--cdnType=') >= 0;
});

const cdnType = cdnTypeArgv ? cdnTypeArgv.split('=')[1] : 'merchant';
const cleanPluginArr = cdnType === 'merchant' ? [new CleanPlugin([path.join(__dirname, 'cdn')])] : [];

const alias = {
    sprite: 'sprite.less',
    core: '../../core',
    components: '../../components',
};
if (cdnType === 'merchant') {
    alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/assets/icons.js');
}

const configs = {
    entry: [
        path.join(__dirname, `src/${cdnType}.cdn.entry.js`),
    ],
    output: {
        path: cdnDir,
        publicPath: '/',
        filename: `js/${cdnType}-frame.min.js`,
        chunkFilename: `js/${cdnType}-frame-[name].js`,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        extends: path.join(__dirname, '.babelrc'),
                        cacheDirectory: true,
                    },
                },
                exclude: /node_modules/,
            },
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
                        publicPath: '../images/',
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
        // new BundleAnalyzerPlugin(),
        new LodashModuleReplacementPlugin({
            collections: true,
            paths: true,
        }),
        ...cleanPluginArr,
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
        new AntdDayjsWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: manifestBaseDll,
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: manifestVenderDll,
        }),
        new MiniCssExtractPlugin({
            filename: `css/${cdnType}-frame.min.css`,
        }),
        new CopyPlugin([{
            from: 'src/assets/js/*.js',
            to: path.join(cdnDir, 'js'),
            flatten: true,
        }]),
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
        alias,
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'build'),
            path.join(__dirname, 'node_modules'),
        ],
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 400000,
        maxEntrypointSize: 600000,
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'async',
        //     minSize: 30000,
        //     maxSize: 0,
        //     minChunks: 1,
        //     maxAsyncRequests: 6,
        //     maxInitialRequests: 4,
        //     automaticNameDelimiter: '~',
        //     cacheGroups: {
        //         shim: {
        //             chunks: 'all',
        //             test: /core-js/,
        //             name: 'shim',
        //             priority: -10,
        //         },
        //         ad: {
        //             chunks: 'all',
        //             name: 'ad',
        //             test: /antd/,
        //             priority: 1,
        //         },
        //         adrc: {
        //             chunks: 'all',
        //             name: 'adrc',
        //             test: /rc-/,
        //             priority: 3,
        //         },
        //         default: {
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true,
        //         },
        //     },
        // },
        // runtimeChunk: {
        //     name: 'runtime',
        // },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    output: {
                        beautify: false,
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true,
                    },
                },
            }),
        ],
    },
};

module.exports = configs;

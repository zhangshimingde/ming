import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import less from 'rollup-plugin-less';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import { version } from './package.json';

const env = process.env.NODE_ENV;

export default {
    input: 'src/cdn.entry.js',
    output: {
        file: 'cdn/cdn.js',
        format: 'iife',
        name: 'fulu',
        banner: `/* fulu-cdn ${version} */`,
    },
    plugins: [
        less({
            output: './cdn/fulu.min.css',
        }),
        babel({
            babelrc: false,
            presets: [
                ['@babel/preset-env', {
                    loose: false,
                    modules: false,
                }],
                '@babel/preset-react',
            ],
            plugins: [
                ['import', {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css',
                }],
            ],
            exclude: 'node_modules/**', // 只编译我们的源代码
        }),
        resolve({
            jsnext: true,
            main: true,
            // 将自定义选项传递给解析插件
            customResolveOptions: {
                moduleDirectory: 'node_modules',
            },
        }),
        commonjs({ // Convert CommonJS modules to ES6
        }),
        json(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
    ],
    // 指出应将哪些模块视为外部模块
    // external: ['antd'],
};

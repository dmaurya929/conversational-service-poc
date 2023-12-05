/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// webpack.config.adobeio.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var isTestEnvironment = process.env.NODE_ENV == 'test';

const serverConfig = {
    // Tell webpack to start bundling our app at app/index.js
    entry: ['./src/index.ts'],
    target: 'node',
    externals: nodeExternals({
        allowlist: [
            '.bin',
            'source-map-support/register',
            // 'babel-polyfill',
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/,
            (v) =>
                v.indexOf('babel-plugin-universal-import') === 0 ||
                v.indexOf('react-universal-component') === 0 ||
                v.indexOf('af-core') !== -1 || // added because json-formula is ESM based
                v.indexOf('af-react-renderer') !== -1 || // added because json-formula is ESM based
                v.indexOf('json-formula') !== -1 || // added because json-formula is ESM based
                v.indexOf('node-fetch') !== -1
        ],
    }),
    mode: 'development',
    // Output our app to the dist/ directory
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        filename: isTestEnvironment ? '[name].js' : 'index.js',
        path: path.resolve(__dirname + '/dist'),
        publicPath: '/',
        library:{
            type: 'commonjs-module'
        } ,
    },
    // Emit source maps so we can debug our code in the browser
    devtool: 'source-map',

    resolve: {
        extensions: ['.js', '.ts'],

        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebook/create-react-app/issues/253
        modules: ['node_modules']
    },
    module: {
        rules: [
          {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },

    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [

        // Output a single chunk at most to make sure all code is loaded on
        // the server side.
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        })
    ]
};

module.exports = serverConfig;
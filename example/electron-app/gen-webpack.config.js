/**
 * Don't touch this file. It will be regenerated by theia build.
 * To customize webpack configuration change D:\sourcecode\fe\theia-hello-world-extension\electron-app\webpack.config.js
 */
// @ts-check
const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin')

const outputPath = path.resolve(__dirname, 'lib');
const { mode, staticCompression }  = yargs.option('mode', {
    description: "Mode to use",
    choices: ["development", "production"],
    default: "production"
}).option('static-compression', {
    description: 'Controls whether to enable compression of static artifacts.',
    type: 'boolean',
    default: true
}).argv;
const development = mode === 'development';

const monacoEditorCorePath = development ? 'D:/sourcecode/fe/theia-hello-world-extension/node_modules/@theia/monaco-editor-core/dev/vs' : 'D:/sourcecode/fe/theia-hello-world-extension/node_modules/@theia/monaco-editor-core/min/vs';

const plugins = [
    new CopyWebpackPlugin({
        patterns: [{
            from: monacoEditorCorePath,
            to: 'vs'
        }]
    }),
    new webpack.ProvidePlugin({
        // the Buffer class doesn't exist in the browser but some dependencies rely on it
        Buffer: ['buffer', 'Buffer']
    })
];
// it should go after copy-plugin in order to compress monaco as well
if (staticCompression) {
    plugins.push(new CompressionPlugin({}));
}
plugins.push(new CircularDependencyPlugin({
    exclude: /(node_modules|examples)[\\|/]./,
    failOnError: false // https://github.com/nodejs/readable-stream/issues/280#issuecomment-297076462
}));

module.exports = {
    mode,
    plugins,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src-gen/frontend/index.js'),
    output: {
        filename: 'bundle.js',
        path: outputPath,
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]'
    },
    target: 'electron-renderer',
    cache: staticCompression,
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /materialcolors\.css$|\.useable\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /materialcolors\.css$|\.useable\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            esModule: false,
                            injectType: 'lazySingletonStyleTag',
                            attributes: {
                                id: 'theia-theme'
                            }
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000,
                    }
                },
                generator: {
                    dataUrl: {
                        mimetype: 'image/svg+xml'
                    }
                }
            },
            {
                test: /\.(jpg|png|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[hash].[ext]'
                }
            },
            {
                // see https://github.com/eclipse-theia/theia/issues/556
                test: /source-map-support/,
                loader: 'ignore-loader'
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
                exclude: /jsonc-parser|fast-plist|onigasm/
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000,
                    }
                },
                generator: {
                    dataUrl: {
                        mimetype: 'image/svg+xml'
                    }
                }
            },
            {
                test: /node_modules[\\|/](vscode-languageserver-types|vscode-uri|jsonc-parser|vscode-languageserver-protocol)/,
                loader: 'umd-compat-loader'
            },
            {
                test: /\.wasm$/,
                type: 'asset/resource'
            },
            {
                test: /\.plist$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        fallback: {
            'child_process': false,
            'crypto': false,
            'net': false,
            'path': false,
            'process': false,
            'os': false,
            'timers': false
        },
        extensions: ['.js'],
        alias: {
            'vs': path.resolve(outputPath, monacoEditorCorePath)
        }
    },
    stats: {
        warnings: true,
        children: true
    }
};
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let OpenBrowserPlugin = require('open-browser-webpack-plugin');

const url = 'http://localhost:8000';

const devServer = {
    hot: true,
    noInfo: false,
    quiet: false,
    port: 8000,
    // #https://github.com/webpack/webpack-dev-server/issues/882
    disableHostCheck: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    inline: true,
    historyApiFallback: {
        index: '/'
    },
    stats: {
        colors: true,
        modules: false
    },
    contentBase: path.resolve(__dirname, './dist'),
    publicPath: '/'
};

module.exports = {
    context: path.resolve(__dirname, '.'),
    entry: {
        app: [
            'webpack/hot/dev-server',
            `webpack-dev-server/client?http://localhost:8000/`,
            path.resolve(__dirname, './page/index.js')
        ]
    },
    output: {
        filename: '[name].js',
        path: devServer.contentBase,
        publicPath: devServer.publicPath,
        sourceMapFilename: '[file].map',
        chunkFilename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        esModule: false
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            }, 
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.vue', '.js'],
        modules: [path.join(__dirname, '../node_modules')],
        alias: {
            'vue$': 'vue/dist/vue.js',
            revuejs: path.resolve(__dirname, '../src/index.js')
        }
    },

    resolveLoader: {
        modules: [path.join(__dirname, '../node_modules')]
    },

    performance: {
        hints: false
    },

    devServer,

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            }
        }),

        new OpenBrowserPlugin({ url: url })
    ]
};

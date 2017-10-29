const { join, resolve } = require('path')

const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

const config = {
    entry: {"app":"./main.js"},
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            "root": join(__dirname, 'node_modules'),
            'views': join(__dirname, '/views'),
            "assets": join(__dirname, '/assets'),
            "common": join(__dirname, '/common'),
            'components': join(__dirname, '/components')
        }
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'vendors',
            filename: 'js/vendors.js',
            // chunks: "main"
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: "./index.html",
            inject: 'body',
            favicon: './assets/img/logo.png',
            hash: process.env.NODE_ENV === 'production',
            // chunks: ['vendors', "index"]
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader'],
                            fallback: 'style-loader'
                        }),
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                            fallback: 'style-loader'
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                   use: ['css-loader?minimize', 'autoprefixer-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        "limit": 1024,
                        "name": 'img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        "limit": 1024,
                        "name": '/font/[name].[ext]'
                    }
                }]
            }
        ]
    }
}




// http://vue-loader.vuejs.org/en/workflow/production.html
if (process.env.NODE_ENV === 'development') {
    config.devtool = '#source-map';
    config.output = {
        path: resolve(__dirname, './dist'),
        filename: 'js/[name].js'
    },
    //https://webpack.js.org/configuration/dev-server/#devserver
    config.devServer = {
        port: 9000,
        contentBase:'./dist',
        open:true,
        hot:true,
        openPage:"index.html",
        historyApiFallback: false,
        inline:true,
        proxy: {
            '/api': {
                target: 'http://admin.quizyun.com/',
                changeOrigin: true,
                pathRewrite: { '^/api': 'api' }
            },
            '/mapi': {
                target: 'http://admin.quizyun.com/',
                changeOrigin: true,
                pathRewrite: { '^/mapi': 'mapi' }
            },
            '/static':{
                target: 'http://admin.quizyun.com/',
                changeOrigin: true,
                pathRewrite: { '^/static': 'static' }
            }
        }
    };
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ])
} else {

    config.output = {
        path: resolve(__dirname, '../static'),
        publicPath: './',
        filename: 'js/[name].js'
    },

    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"production"' }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { "warnings": false }
        })
    ])
}


module.exports = config

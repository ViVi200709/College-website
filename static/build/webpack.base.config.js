const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sourcePath = path.join(__dirname, './static/src');
const outputPath = path.join(__dirname, './../output/dist/');
const outputPath1 = path.resolve(__dirname, './../output/dist/');

module.exports = {

  entry: {
    'main': './static/src/index.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch']
  },
  output: {
    filename: '[name].js',
    // path: path.resolve(__dirname, '../output/dist'),
    path: outputPath,
    publicPath: '/',
    chunkFilename: '[name].js'
  },
  module: {

    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              // presets: ['es2015', 'react'],
              cacheDirectory: true
            }
          }
        ]
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({fallback: "style-loader", use: ['css-loader']})
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'sass-loader']
        })
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
        })
      }, {
        test: /\.(png|gif|jpg|jpeg|bmp)$/i,
        use: [
          {
            loader: 'url-loader?limit=5000'
          }
        ]
      }, // 限制大小5kb
    ]
  },
  resolve: {
    extensions: [
      '.js', '.jsx'
    ],
    modules: [sourcePath, 'node_modules']
  },
  plugins: [
    // html 模板插件
    new HtmlWebpackPlugin({template: './static/src/index.tmpl.html'}),

    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor'],
     minChunks: Infinity,
    // filename: 'js/[name].js'})
    filename:'vendor.js'})
  ],
  devServer: {
    proxy: {
      // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3001 上，由 koa 提供 mock 数据。
      // koa 代码在 ./mock 目录中，启动命令为 npm run dev_server
      '/api': {
        target: 'http://localhost:3001',
        secure: false
      }
    },
    port: 8080,
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    hot: true // 使用热加载插件 HotModuleReplacementPlugin
  }
};

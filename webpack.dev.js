const path = require("path")
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
let devConfig = {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, 'dist'), 
    compress: true,
    hot: true,
    overlay: true, 
    open:true,
    publicPath: '/',
    host: 'localhost',
    port: '1200'
  },
  output: {
    filename: "main.[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: true,
              plugins: loader => [
                require("autoprefixer")()
                // 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
                // require('postcss-cssnext')()
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
module.exports = merge(common, devConfig)
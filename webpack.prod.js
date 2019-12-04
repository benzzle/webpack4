const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin") //抽离独立的css文件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin") //压缩css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin") //压缩js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
let prodConfig = {
  mode: "production",
  output: {
    filename: "main.[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css", // 最终输出的文件名
      chunkFilename: "[id].[hash].css"
    }),
    new OptimizeCssAssetsPlugin({}),
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
  ]
}
module.exports = merge(common, prodConfig)
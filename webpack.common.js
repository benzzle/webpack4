const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin") //动态应用打包后的文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin") //清理目录插件
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        include: [path.resolve(__dirname, "src/")],
        use: [
          {
            loader: "url-loader", // 根据图片大小，把图片转换成 base64
            options: { limit: 10000 }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { progressive: true, quality: 65 },
              optipng: { enabled: false },
              pngquant: { quality: "65-90", speed: 4 },
              gifsicle: { interlaced: false },
              webp: { quality: 75 }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: [path.resolve(__dirname, 'src/')],
        use: [ 'file-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack4 study!", // 生成的文件标题
      filename: "main.html", // 最终生成的文件名
      minify: {
        // 压缩选项
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
        removeAttributeQuotes: true // 移除双引号
      }
    }),
    new CleanWebpackPlugin()
  ],
  entry: "./src/index.js",
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src/')
    }
  }
}

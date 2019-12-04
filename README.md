## 一、 项目初始化

新建并进入文件夹 `demo`:

```
mkdir demo
cd demo
```

然后本地安装 `webpack` 和 `webpack-cli` （ **在 Webpack 4.0以后需要单独安装**）：

```
npm install webpack webpack-cli --save-dev
```

初始化项目结构：

![](./1.png)

安装 `lodash`：

```
npm install lodash --save-dev
```

`--save` 可以简写为 `-S`, `--save-dev` 可以简写为 `-D`._

开发 `index.js`：

```
import _ from 'lodash';

function createElement(){
    let div = document.createElement('div');
    div.innerHTML = _.join(['my', 'name', 'is', 'steven'], '');
    return div;
}
document.body.appendChild(createElement());
```

开发 `webpack.config.js`：

```
const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

开始第一次打包任务：

```
npx webpack
```

打包成功后，生成的文件会保存在 `dist` 目录中。

现在在 `dist/index.html` 中引入打包后的 `main.js`，打开浏览器测试：

```
<script src="./main.js"></script>
```

## 二、 webpack 处理 CSS 模块

在项目 `src` 目录中，新建 `style` 文件夹，并新建 `index.css` 文件：

![](./2.png)

接着在 `index.js` 的新建元素方法中，添加 `class` 为 `box`，这样新建的元素就带有 `box` 的 `class` 属性：

```
// src/index.js

import _ from 'lodash';
import './style/index.css';

function createElement(){
  let div = document.createElement('div');
  div.innerHTML = _.join(['my', 'name', 'is', 'steven'], '');
  div.className = 'box';
  return div;
}
document.body.appendChild(createElement());
```

然后在 `index.css` 文件为 `box` ：

```
// src/style/index.css

.box{
    color: red;
}
```

**注意：**

这里使用 `import './style/index.css';` 引入我们的样式文件，是没办法解析使用，这时我们需要在 `webpack` 中使用到第三方 `loader` 插件，这里我们使用：

* `css-loader` ： 用于处理 `css` 文件，使得能在 js 文件中引入使用；
* `style-loader` ： 用于将 `css` 文件注入到 `index.html` 中的 `<style>`标签上；
* 安装插件:
```
npm install --save-dev style-loader css-loader
```
复制代码
再到 `webpack.config.js` 中添加 `css` 解析的 `loader` 配置：
```$xslt
// webpack.config.js

module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }
  ]
}
```
参数介绍：` test`需要匹配的模块后缀名； 
`use`对应处理的 loader 插件名称（处理顺序是从右往左）。
``` 
npx webpack
```


这时候可以看见 <code>index.html</code> 中，文本已经变成红色，并且 <code>css</code> 代码已经添加到 `style` 标签上。
## 三、 webpack 模块介绍和处理 sass 
1. webpack 模块介绍  
这里介绍的模块（module）是指 ` webpack.config.js `文件中的 `module `配置，它决定了如何处理项目中的不同类型模块。
比如上一节介绍的，使用 `style-loader` 、 `css-loader` 两个插件去处理 css 文件。
 webpack 模块支持如下语句：

* ES2015` import` 语句；
* CommonJS `require()` 语句；
* AMD `define` 和 `require` 语句；
* `css/sass/less` 文件中` @import `语句；
* 样式` (url(...)) `或者 HTML 文件` (<img src=...>)` 中的图片链接 (image url)；

  这里建议使用 `ES2015` 的引入方法，毕竟这是标准。
  
2.常用模块  
2.1 module.noParse  
值的类型：`RegExp | [RegExp] | function`
防止 webpack 解析那些符合匹配条件的文件，忽略的文件夹中不应该含有 `import`、`require`、`define`的调用，或任何其他导入机制，忽略的 library 可以提高构建效率。
```
// webpack.config.js

module: {
  noParse: function(content){
    return /jquery|lodash/.test(content);
  }
}
```
2.2 module.rules  
创建模块时，匹配请求的规则数组。按照规则为对应模块使用对应的 `loader`，或修改解析器（parser）。  
```
// webpack.config.js

module: {
  rules: [
    { test: /\.css$/, use: ['style-loader', 'css-loader']}
  ]
}
```
module.rules 参数有：

`use`：为模块使用指定 `loader`，并且可以传入一个字符串数组，加载顺序从右往左。

`module.rules` 匹配条件有：

`{test : Condition}`：匹配特定条件，非必传，支持一个正则表达式或正则表达式数组；  
`{include : Condition}`：匹配特定条件，非必传，支持一个字符串或字符串数组；  
`{exclude : Condition}`：排除特定条件，非必传，支持一个字符串或字符串数组；  
`{and : [Condition]}`：必须匹配数组中的所有条件；  
`{or : [Condition]}`：匹配数组中任一条件；  
`{not : [Condition]}`：必须排除这个条件；  

```$xslt
// webpack.config.js

module: {
  rules: [
    { 
      test: /\.css$/, 
      use: ['style-loader', 'css-loader'],
      include: [
        path.resolve(__dirname, "app/style.css"),
        path.resolve(__dirname, "vendor/style.css")
      ]
    }
  ]
}
```
3.加载 Sass 文件  
需要使用到 `sass-loader` 的插件，这里先安装：
```$xslt
npm install sass-loader node-sass --save-dev
```
复制代码在 src/style 目录下添加 `steven.scss` 文件，并添加内容：
```
// steven.scss

$bg-color: #ee3;
.box{
    background-color: $bg-color;
}
```

复制代码然后在 `src/index.js`中引入 `steven.scss` 文件：
```$xslt
// src/index.js
import './style/steven.scss';
```
复制代码再 `npx webpack` 重新打包，并打开 `dist/index.html` 可以看到背景颜色已经添加上去：  
4.添加快捷打包命令  
像 `npx webpack` 这个命令我们需要经常使用，对于这种命令，我们可以把它写成命令，方便每次使用。
我们在 `package.json` 的 `scripts` 中添加一个命令为 `build`，以后打包只要执行 `npm run build` 即可：
```$xslt
"scripts": {
  "build": "npx webpack --config webpack.config.js"
},
```
复制代码这里的 `--config webpack.config.js` 中，`--config` 后面跟着的是 webpack 配置文件的文件名，默认可以不写。
##四、 webpack 开启 SourceMap 和添加 CSS3 前缀
添加 `SourceMap` 是为了方便打包之后，我们在项目中调试样式，定位到样式在源文件的位置。
1. 开启 SourceMap
在 `css-loader` 和 `sass-loader` 都可以通过设置 `options` 选项启用 `sourceMap`。
```$xslt
// webpack.config.js

rules: [
  {
    test: /\.(sc|c|sa)ss$/,
    use: [
      "style-loader", 
      {
        loader:"css-loader",
        options:{ sourceMap: true }
      },
      {
        loader:"sass-loader",
        options:{ sourceMap: true }
      },
    ]
  }
]
```
复制代码再重新打包，看下 index.html 的样式，样式已经定位到源文件上了：  

2.为样式添加 CSS3 前缀  
这里我们用到 PostCSS 这个 loader，它是一个 CSS 预处理工具，可以为 CSS3 的属性添加前缀，样式格式校验（stylelint），提前使用 CSS 新特性，实现 CSS 模块化，防止 CSS 样式冲突。
首先安装 PostCSS：
```$xslt
npm install postcss-loader autoprefixer --save-dev
```
复制代码另外还有:  
postcss-cssnext 可以让我们使用 CSS4的样式，并能配合 autoprefixer 进行浏览器部分兼容的补全，还支持嵌套语法。  
precss 类似 scss 语法，如果我们只需要使用嵌套，就可以用它替换 scss。  
postcss-import 让我们可以在@import CSS文件的时 webpack 能监听并编译。  
开始添加 postcss-loader 并设置 autoprefixer：
```$xslt
// webpack.config.js

rules: [
  {
    test: /\.(sc|c|sa)ss$/,
    use: [
      "style-loader", 
      {
        loader:"css-loader",
        options:{ sourceMap: true }
      },
      {
        loader:"postcss-loader",
        options: {
          ident: "postcss",
          sourceMap: true,
          plugins: loader => [
            require('autoprefixer')(),
            // 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
            // require('postcss-cssnext')()
          ]
        }
      },
      {
        loader:"sass-loader",
        options:{ sourceMap: true }
      },
    ]
  }
]
```
还需要在 package.json 中添加判断浏览器版本：  
```$xslt
// package.json

{
  //...
  "browserslist": [
    "> 1%", // 全球浏览器使用率大于1%，最新两个版本并且是IE8以上的浏览器，加前缀 
    "last 2 versions",
    "not ie <= 8"
  ]
}
```
为了做测试，我们修改 src/style/steven.scss 中 .box 的样式：
```$xslt
// src/style/steven.scss

.box{
    background-color: $bg-color;
    display: flex;
}
```
然后重新打包，可以看见 CSS3 属性的前缀已经添加上去了：
##五、 webpack 将 CSS 抽取成单独文件
在之前学习中，CSS 样式代码都是写到 index.html 的 `<style>` 标签中，这样样式代码多了以后，很不方便。
于是我们需要将这些样式打包成单独的 CSS 文件。
webpack4 开始使用 mini-css-extract-plugin 插件，而在 1-3 版本使用 extract-text-webpack-plugin。  
>注意：抽取样式以后，就不能使用 style-loader 注入到 html中  

安装插件：
 ```$xslt
 npm install mini-css-extract-plugin --save-dev
```
引入插件：
```$xslt
// webpack.config.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```
然后修改 rules，将 style-loader，替换成 MiniCssExtractPlugin.loader ，然后添加 plugins 配置项：
```$xslt
// webpack.config.js

module: {
  rules: [
    {
      test: /\.(sc|c|sa)ss$/,
      use: [
        MiniCssExtractPlugin.loader, 
        {
          loader:"css-loader",
          options:{ sourceMap: true }
        },
        {
          loader:"postcss-loader",
          options: {
            ident: "postcss",
            sourceMap: true,
            plugins: loader => [require('autoprefixer')()]
          }
        },
        {
          loader:"sass-loader",
          options:{ sourceMap: true }
        },
      ]
    }
  ]
},
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].css', // 最终输出的文件名
    chunkFilename: '[id].css'
  })
]
```
然后重新打包，这时候可以看到我们 dist 目录下就多了个 main.css 文件  
因为现在已经将 CSS 都抽取成单独文件，所以在 dist/index.html 中，我们需要手动引入 main.css 了：
```$xslt
// index.html

<link rel="stylesheet" href="main.css">
```
##六、 webpack 压缩 CSS 和 JS
为了缩小打包后包的体积，我们经常做优化的时候，将 CSS 和 JS 文件进行压缩，这里需要使用到不同的插件。  
1.压缩 CSS
使用 optimize-css-assets-webpack-plugin 压缩 CSS 的插件。
安装插件：
```$xslt
npm install optimize-css-assets-webpack-plugin --save-dev
```
使用插件：
```$xslt
// webpack.config.js

// ... 省略
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  // ... 省略
  plugins: [
    // ... 省略
    new OptimizeCssAssetsPlugin({})
  ],
}
```
重新打包，可以看到 main.css 已经被压缩成一行代码，即压缩成功~  
2.压缩 JS
使用 uglifyjs-webpack-plugin 压缩 JS 的插件。

安装插件：
```$xslt
npm install uglifyjs-webpack-plugin --save-dev
```
引入插件：
```$xslt
// webpack.config.js

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
```
使用插件：
```$xslt
// webpack.config.js
// ... 省略
module.exports = {
  // ... 省略
  plugins: [
    // ... 省略
    new OptimizeCssAssetsPlugin({}),
    new UglifyJsPlugin({
      cache: true, parallel: true, sourceMap: true
    })
  ],
}
```
其中 UglifyJsPlugin 的参数：

cache：当 JS 没有发生变化则不压缩；  
parallel：是否启用并行压缩；  
sourceMap：是否启用 sourceMap；

然后重新打包，查看 main.js，已经被压缩了：
##七、webpack 为文件名添加 hash 值
由于我们打包出来的 css、js 文件是静态文件，就存在缓存问题，因此我们可以给文件名添加 hash 值，防止缓存。
1. 添加 hash 值
直接在 webpack.config.js 中，为需要添加 hash 值的文件名添加 [hash] 就可以：
```$xslt
// webpack.config.js

module.exports = {
  // ... 省略其他
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
  ],
}
```
复制代码配置完成后，重新打包，就可以看到文件名中包含了 hash 值了：  
2.动态引用打包后的文件  
由于我们前面给打包的文件名添加了 hash 值，会导致 index.html 引用文件错误，所以我们需要让它能动态引入打包后的文件。

这里我们使用 HtmlWebpackPlugin 插件，它可以把打包后的 CSS 或者 JS 文件直接引用注入到 HTML 模版中，就不用每次手动修改。  
安装插件：
```$xslt
npm install html-webpack-plugin --save-dev
```

复制代码引入插件：
```$xslt
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
```
```
// webpack.config.js

plugins: [
  new HtmlWebpackPlugin({
    title: "steven study!",   // 生成的文件标题
    filename: "main.html", // 最终生成的文件名
    minify: { // 压缩选项
      collapseWhitespace: true, // 移除空格
      removeComments: true, // 移除注释
      removeAttributeQuotes: true, // 移除双引号
    }
  })
],
```
复制代码关于 html-webpack-plugin 更多介绍可以《查看文档》  
接着我们打包以后，可以看见 dist 目录下，多了 main.html 的文件，格式化以后，可以看出，已经动态引入打包后的 CSS 文件和 JS 文件了：
##八、 webpack 清理目录插件
在之前，我们每次打包都会生成新的文件，并且在添加 hash 值以后，文件名不会出现重复的情况，导致旧文件的冗余。

为了解决这个问题，我们需要在每次打包之前，将 /dist 目录清空，再进行打包。
这里我们使用 clean-webpack-plugin 插件来实现。
安装插件：
```$xslt
npm install clean-webpack-plugin --save-dev
```
引入插件：
```$xslt
// webpack.config.js

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```
使用插件：
```$xslt
// webpack.config.js

plugins: [
  new CleanWebpackPlugin()
],
```
参数 cleanOnceBeforeBuildPatterns 是表示需要清除的文件夹。  
这样我们每次打包之前，都会先将 /dist 目录清空一次，再执行打包。
##九、 webpack 图片处理和优化
1. 图片处理
在项目中引入图片：
```$xslt
// src/style/steven.scss

.box{
    background-color: $bg-color;
    display: flex;
    background: url('./../assets/logo.jpg')
}
```
复制代码这时候我们如果直接打包，会报错。  
我们需要使用 file-loader 插件来处理文件导入的问题。  
安装插件：
```$xslt
npm install file-loader --save-dev
```
复制代码使用插件：
```$xslt
// webpack.config.js

module: {
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    use: ["file-loader"]
  }]
},
```
复制代码重新打包以后，发现 dist 目录下多了一个如 373e5e0e214390f8aa9e7abb4c7c635c.jpg 名称的文件，这就是我们打包后的图片。

2.图片优化  
更进一步，我们可以对图片进行压缩和优化，这里我们用到 image-webpack-loader 插件来处理。  
安装插件：
```$xslt
npm install image-webpack-loader --save-dev
```
复制代码使用插件：
```$xslt
// webpack.config.js

module: {
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    include: [path.resolve(__dirname, 'src/')],
    use: ["file-loader",{
        loader: "image-webpack-loader",
        options: {
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: '65-90', speed: 4 },
          gifsicle: { interlaced: false },
          webp: { quality: 75 }
        }
      },
    ]
  }]
},
```
更多参数介绍，可访问中文官网的介绍:
《image-webpack-loader》

再重新打包，我们可以看到图片打包前后，压缩了很大：

>链接：https://juejin.im/post/5d518b4de51d4561cc25f013  
来源：掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

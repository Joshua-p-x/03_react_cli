// const path = require('path');
// const EslintWebpackPlugin = require('eslint-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// function getStyleLoaders() {
//   return [
//     'style-loader',
//     'css-loader',
//     // 处理css兼容性问题
//     // 配合package.json中browserslist来指定兼容规则
//     {
//       loader: 'postcss-loader',
//       options: {
//         postcssOptions: {
//           plugins: ['postcss-preset-env'],
//         },
//       },
//     },
//   ];
// }

// module.export = {
//   entry: './src/index.js',

//   output: {
//     path: undefined,
//     filename: 'static/js/[name].js',
//     chunkFilename: 'static/js/[name].chunk.js',
//     assetModuleFilename: 'static/media/[hash:10][ext][query]',
//   },

//   module: {
//     rules: [
//       // 1.处理css文件
//       {
//         test: /\.css$/,
//         use: getStyleLoaders(),
//       },
//       {
//         test: /\.less$/,
//         use: [...getStyleLoaders(), 'less-loader'],
//       },
//       {
//         test: /\.sass$/,
//         use: [...getStyleLoaders(), 'sass-loader'],
//       },
//       {
//         test: /\.styl$/,
//         use: [...getStyleLoaders(), 'stylus-loader'],
//       },
//       // 2.处理css文件
//       {
//         test: /\.(jpe?g | png | gig | webp | svg)$/,
//         type: 'asset',
//         // 当图片体积小于maxSize时，转化为base64，减少请求次数
//         parser: {
//           dataUrlCondition: {
//             maxSize: 10 * 1024,
//           },
//         },
//       },
//       // 3.处理其他资源文件
//       {
//         test: /\.(woff2? | ttf)$/,
//         type: 'asset/source',
//       },
//       // 4.处理js文件
//       {
//         test: /\.(jsx | js)$/,
//         include: path.resolve(__dirname, '../src'),
//         loader: 'babel-loader',
//         options: {
//           cacheDirectory: true,
//           cacheCompression: false,
//         },
//       },
//     ],
//   },

//   // 处理HTML文件
//   plugins: [
//     new EslintWebpackPlugin({
//       context: path.resolve(__dirname, '../src'),
//       exclude: 'node_modules',
//       cache: true,
//       cacheLocation: path.resolve(
//         __dirname,
//         '../node_modules/.cache/.eslintcache'
//       ),
//     }),
//     new HtmlWebpackPlugin({
//       template: path.resolve(__dirname, '../public/index.html'),
//     }),
//   ],

//   // 压缩代码体积
//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//     },
//     runtimeChunk: {
//       name: (entrypoint) => `runtime~${entrypoint.name}.js`,
//     },
//   },
//   mode: 'development',
//   devtool: 'cheap-module-source-map',
//   // webpack 解析模块加载选项
//   resolve: {
//     // 自动补全文件拓展名
//     // 加载文件时，若无后缀名则先添加.jsx进行加载，如果不能则添加.js进行加载，直到可以或者都不可以为止
//     extensions: [".jsx", ".js", ".json"]
//   },
//   devServer: {
//     host: 'localhost',
//     port: 3000,
//     open: true,
//     hot: true,
//   },
// };

const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");

const getStyleLoaders = (preProcessor) => {
  return [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  entry: "./src/index.js",
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
          },
          {
            test: /\.(jsx|js)$/,
            include: path.resolve(__dirname, "../src"),
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              // plugins: [
              //   // "@babel/plugin-transform-runtime", // presets中包含了
              //   "react-refresh/babel", // 开启js的HMR功能
              // ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
    // // 将public下面的资源复制到dist目录去（除了index.html）
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "../public"),
    //       to: path.resolve(__dirname, "../dist"),
    //       toType: "dir",
    //       noErrorOnMissing: true, // 不生成错误
    //       globOptions: {
    //         // 忽略文件
    //         ignore: ["**/index.html"],
    //       },
    //       info: {
    //         // 跳过terser压缩js
    //         minimized: true,
    //       },
    //     },
    //   ],
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3001,
    hot: true,
    // compress: true,
    // historyApiFallback: true, // 解决react-router刷新404问题
  },
  mode: "development",
  devtool: "cheap-module-source-map",
};

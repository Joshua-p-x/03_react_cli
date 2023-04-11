const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getStyleLoaders() {
  return [
    'style-loader',
    'css-loader',
    // 处理css兼容性问题
    // 配合package.json中browserslist来指定兼容规则
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
      },
    },
  ];
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: [...getStyleLoaders(), 'less-loader'],
          },
          {
            test: /\.s(ac)ss$/,
            use: [...getStyleLoaders(), 'sass-loader'],
          },
          {
            test: /\.styl$/,
            use: [...getStyleLoaders(), 'stylus-loader'],
          },
          // 2.处理css文件
          {
            test: /\.(jpe?g | png | gig | webp | svg)$/,
            type: 'asset',
            // 当图片体积小于maxSize时，转化为base64，减少请求次数
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
          },
          // 3.处理其他资源文件
          {
            test: /\.(ttf|woff2?)$/,
            type: 'asset/resource',
          },
          // 4.处理js文件
          {
            test: /\.(jsx?)$/,
            include: path.resolve(__dirname, '../src'),
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
    ],
  },

  // 处理HTML文件
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],

  // 压缩代码体积
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
  },
  // webpack 解析模块加载选项
  resolve: {
    // 自动补全文件拓展名
    // 加载文件时，若无后缀名则先添加.jsx进行加载，如果不能则添加.js进行加载，直到可以或者都不可以为止
    extensions: ['.jsx', '.js', '.json'],
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 3001,
    hot: true,
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
};

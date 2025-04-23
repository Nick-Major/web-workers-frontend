const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devServer: {
    open: true,
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: true,

    static: {
      directory: path.join(__dirname, 'dist'),
      serveIndex: true, // Показывать индекс при отсутствии файла
    },

    devMiddleware: {
      publicPath: '/',
      writeToDisk: false, // Не записывать файлы на диск (использует память)
    },

    proxy: [
      {
        context: ['/images', '/news'],
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        headers: {
          Connection: 'keep-alive', // Для стабильности при искусственной задержке
        },
        onProxyReq(proxyReq) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] Проксируем запрос к: ${proxyReq.path}`);
          }
        },
      },
    ],

    client: {
      overlay: {
        errors: true,
        warnings: false,
      }, // Показывать ошибки компиляции в браузере
      logging: 'warn', // Уровень логов в браузере
    },
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },

  entry: './src/index.js',
  target: 'web',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true,
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        API_URL: JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
      },
    }),

    ...(isProduction
      ? [
          new InjectManifest({
            swSrc: path.resolve(__dirname, 'src/sw.js'),
            swDest: 'sw.js',
            exclude: [/\.map$/, /^manifest.*\.js$/],
          }),
        ]
      : []),
  ],
};

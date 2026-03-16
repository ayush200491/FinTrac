const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(API_URL),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    // contentBase: path.join(__dirname, 'public'),
    // publicPath: '/',
    compress: true,
    port: 9000,
    open: true,
    // Proxy requests to the backend server
    proxy: [{
      context: ['/api'],
      target: API_URL,
      logLevel: 'debug' /*optional*/,
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
      secure: false,
    }],
  }
};

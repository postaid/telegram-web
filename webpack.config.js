const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = true;

const Pathes = {
  SRC: path.join(__dirname, 'src'),
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    // host: '192.168.1.2',
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "origin, content-type",
      "Access-Control-Allow-Origin": "*"
    },
  },
  devtool: 'inlin-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Telegram',
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDev? '[name].[chunkhash].css' : '[name].[hash].css',
      chunkFilename: isDev? '[id].[chunkhash].css' : '[id].[hash].css',
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    alias: {
      ROOT: Pathes.SRC
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
      {
        test: /\.(png|gif|svg|jp(e)?g)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: './images/[name].[ext]',
              limit: 0
            }
          },
        ]
      },
      {
        test: /\.tg(json|s)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: './stickers/[name].[ext]',
            limit: 0
          }
        }
      }
    ],
  },
}

const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

/**
 * Используем `chunkhash` только в продакшен сборке так как он значительно
 * замедляет сборку + не позволяет использовать HMR.
 */
const hashPattern = isProd ? 'chunkhash' : 'hash';

const filename = ext => isProd ? `[name].[hash].${ext}` : `[name].${ext}`;

const config = {
  entry: {
    main: './src/index.js',
  },
  mode: isProd ? 'production' : 'development',
  output: {
    chunkFilename: filename('js'),
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.pug/,
        use: {
          loader: 'pug-loader',
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefixer({
                  'browsers': [
                    '> 1%',
                    'last 3 versions',
                  ],
                })
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [path.resolve(__dirname, 'src/css')],
                sourceMap: true,
              },
            },
          },
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$|\.wav$|\.mp3$/,
        use: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              ['env', {
                'targets': {
                  'browsers': ['> 1%', 'IE 11']
                }
              }]
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: !isProd,
    inline: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.pug',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ]
};

module.exports = config;

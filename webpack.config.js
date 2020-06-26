require('dotenv').config();

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './views/**/*.ejs',
    './src/javascripts/*.js',
  ],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

const dist = path.resolve(__dirname, 'dist');

const _getAllFilesFromFolder = (dir) => {

  const filesystem = require("fs");
  let results = {};

  filesystem.readdirSync(dir).forEach((file) => {

    file = dir + '/' + file;
    const stat = filesystem.statSync(file);

    if (stat && stat.isDirectory()) {
      results = Object.assign(results, _getAllFilesFromFolder(file))
    } else {
      const completeFilename = file.substring(file.lastIndexOf('/') + 1);
      const extension = completeFilename.split('.')[1];
      let filename;
      if (completeFilename.includes('match') && extension === 'css') {
        filename = `${completeFilename.split('.')[0]}style`;
      } else {
        filename = completeFilename.split('.')[0];
      }
      results[filename] = file;
    }

  });
  return results;
};

const entries = _getAllFilesFromFolder(path.resolve(__dirname, 'src'));

const config = {
  entry: entries,
  output: {
    path: dist,
    filename: "javascripts/[name].min.js"
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /tailwind\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')(),
              ]
            }
          },
        ]
      },
      {
        test: /tailwind\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
                ...process.env.NODE_ENV === 'production'
                ? [purgecss]
                : []
              ]
            }
          },
        ]
      },
    ]
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../dist/stylesheets/[name].min.css'
    }),
  ],
  watch: process.env.NODE_ENV !== 'production',
};

module.exports = config;
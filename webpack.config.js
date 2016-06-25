"use strict";

let ISDEV = true;

let path = require('path');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let SvgStore = require('webpack-svgstore-plugin');


let pathList = {
  source: __dirname +  '/src',
  build: __dirname + '/app'
};

module.exports = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:8086/',
    // "webpack/hot/dev-server",
    './src/app.js',
  ],
  debug: true,
  output: {
    path: pathList.build,
    filename: 'index.js',
    publicPath: '/app/'
  },
  module: {
    loaders: [
      
      {
        test: /\.less$/,
        // test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!less'),
        // loader: ExtractTextPlugin.extract('style-loader', 'css?minimize'),
        exclude: /(node_modules|bower_components)/
          // function () {
          //   return ISDEV ? 'css!less' : 'css?minimize!less';
          // }()
      },
      
      // { test: /\.less$/, loader: "style!css!less", exclude: /(node_modules|bower_components)/ },
      // { test: /\.css$/, loader: "style!css" },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'url?limit=5000&name=images/[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      // { test: /\.json/, loader: 'url-loader', exclude: /(node_modules|bower_components)/ },
      { test: /\.json$/, loader: 'json', exclude: /(node_modules|bower_components)/ },
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /\.hbs$/, loader: 'handlebars-loader', exclude: /(node_modules|bower_components)/ },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },

  devtool: ISDEV ? 'inline-source-map' : null,
  watch: ISDEV,
  watchOptions: {
    aggregateTimeout: 100
  },
  resolve: {
    // modulesDirectories: ['bower_components'],

    // alias: {
      // jquery: "./bower_components/jquery/dist/jquery.js"
      // jquery: 'jquery/dist/jquery.js',
      // $: 'jquery'
    // },

    // root: pathList.source,
    // extensions: ['', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      // jQuery: 'jquery',
      // 'window.jQuery': 'jquery'
    }),
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    // new BowerWebpackPlugin({
      // modulesDirectories: ['bower_components'],
      // manifestFiles: ['bower.json', '.bower.json'],
      // includes: /.*/,
      // excludes: /.*\.less$/
    // }),
  ],
};
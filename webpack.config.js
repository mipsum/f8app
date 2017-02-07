var path = require('path')
// var fs = require('fs')

var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackMd5Hash = require('webpack-md5-hash')
// var autoprefixer = require('autoprefixer')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var WebpackNotifierPlugin = require('webpack-notifier')

require('shelljs/global')

// var combineLoader = require('webpack-combine-loaders')
// var FlowtypePlugin = require('flowtype-loader/plugin')

// var CopyWebpackPlugin = require('copy-webpack-plugin')
// var ClosureCompilerPlugin = require('webpack-closure-compiler');

// detemine build env
// var TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development'
var TARGET_ENV = process.env.TARGET_ENV === 'build' ? 'production' : 'development'
var isDev = process.env.TARGET_ENV !== 'build'

let joinPath = (...args) => path.resolve(path.join(__dirname, ...args))

let log = (str, o) => {
  console.log(str, o)
  return o
}


let findJs = (p) => {
  let l = find(p)
    .filter(f => f.match(/\.js$/))
    .filter(f => !f.match('__tests__'))
    .filter(f => !f.match('web/dist'))
    .map(s => joinPath(s))

  return l

}


// common webpack config
var commonConfig = {
  entry: {
    poly: 'babel-polyfill',
    main: ['./index.web', ...findJs('./web/alias')],
    info: findJs('./js/tabs/info'),
    maps: findJs('./js/tabs/maps'),
    noti: findJs('./js/tabs/notifications'),
    sche: findJs('./js/tabs/schedule'),

    // vend: [
    //   'react', 'react-dom', 'moment', 'react-native',
    //   'react-relay',
    // ]
    // info: joinPath('web/tab-info'),
    // maps: joinPath('web/tab-maps'),
    // noti: joinPath('web/tab-notifications'),
    // sche: joinPath('web/tab-schedule'),
    // vend: joinPath('web/vendors'),
    // fire: joinPath('node_modules/firebase/firebase-browser'),
  },

  output: {
    path: joinPath('./web/'),
    filename: '[name]-[hash].js',
    // chunkFilename: '[name]-[hash].js',
    pathinfo: true,
    // chunkFilename: '[chunkhash].js',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      'react': joinPath('node_modules/react'),
      'react-dom': joinPath('node_modules/react-dom'),

      // 'js/node_modules/babel-runtime' : joinPath('node_modules/babel-runtime'), //weird
      // 'js/node_modules/core-js' : joinPath('node_modules/core-js'), //weird

      'react-native-fbsdk': joinPath('./web/alias/react-native-fbsdk'),
      'react-native-code-push': joinPath('./web/alias/react-native-code-push'),
      'react-native-linear-gradient': joinPath('./web/alias/react-native-linear-gradient'),

      'parse/react-native': joinPath('./node_modules/parse'),
      'FacebookSDK': joinPath('./web/alias/FacebookSDK'),

      'react-native': joinPath('./web/alias/react-native-web'),
      [joinPath('./web/alias/react-native-web','/Libraries/Utilities/logError')]:
          joinPath('./web/alias/logError'),

      [joinPath('./web/alias/react-native-web','Libraries/Components/Subscribable')]:
          joinPath('./web/alias/Subscribable'),


      [joinPath('./web/alias/react-native-web','Libraries/Components/DrawerAndroid/DrawerLayoutAndroid')]:
          joinPath('/web/alias/DrawerLayoutAndroid'),

      [joinPath('./web/alias/react-native-web','Libraries/Image/resolveAssetSource')]:
          joinPath('./web/alias/resolveAssetSource'),


      './js/tabs/F8TabsView': joinPath('./js/tabs/F8TabsView.android.js'),
      './js/tabs/schedule/img/share.png': joinPath('./js/tabs/schedule/img/share.android.png'),

      './js/common/BackButtonIcon': joinPath('./js/common/BackButtonIcon.android'),
      './js/common/F8Touchable': joinPath('./js/common/F8Touchable.android'),
      './js/common/img/back.png': joinPath('./js/common/img/back.android.png'),
      './js/common/img/back_white.png': joinPath('./js/common/img/back_white.android.png'),
    }
  },

  module: {
    // preLoaders: [
    //   { test: /\.js$/, loader: 'flowtype', exclude: /node_modules/ }
    // ],
    // loaders: [
    //   {
    //     test: /\.(css|scss)$/,
    //     loaders: [
    //       'style-loader',
    //       'css-loader',
    //       'postcss-loader',
    //       'sass-loader'
    //     ]
    //   }
    // ]

    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg|png)$/,
        loader: 'file-loader',
        query: {
          name: 'img/[name]-[md5:hash:base64:7].[ext]',
          outputPath: './web/img/',
        }
      },

      // {
      //   test: /\.js$/,
      //   exclude: [/node_modules/],
      //   loader: 'react-hot',
      // },

      {
        test: /\.js$/,
        // exclude: [/node_modules/],
        loader: 'babel-loader',
        exclude: [
          /node_modules\/(?!(react-native-web|react-native-push-notification|react-native-send-intent|react-native-share)\/).*/
        ],
        query: {

          cacheDirectory: true,
          presets: [
            ['es2015',
              { 'modules': false }
            ],
            {
              "plugins": [
                "./server/schema/babelRelayPlugin"
              ]
            },
            // 'react-hmre',
          ],
          // presets: ['es2015', 'stage-0'],     react-native/Libraries/Image/resolveAssetSource

          plugins: [
            'transform-runtime',
            'transform-flow-strip-types',
            'transform-export-extensions',
            ["transform-class-properties", { "spec": true }],

          ]
        }
      },
    ],
  },
  // cache: false,
  plugins: [
    // new FlowtypePlugin(),
    // new webpack.HotModuleReplacementPlugin(),

    new WebpackNotifierPlugin({
      excludeWarnings: true,
      alwaysNotify: false,
    }),
    //
    new webpack.optimize.OccurrenceOrderPlugin(),


    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      chunks: ['main'],
      // async: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'info',
      chunks: ['info'],
      async: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'noti',
      chunks: ['noti'],
      async: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'sche',
      chunks: ['sche'],
      async: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'maps',
      chunks: ['maps'],
      async: true,
    }),


    new webpack.optimize.CommonsChunkPlugin({
      name: 'vend',
      minChunks (m) {

        // this assumes your vendor imports exist in the node_ms directory
        return m.context && m.context.indexOf('node_modules') !== -1;
       }
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'fire',
    //   chunks: ['fire', 'vend']
    // }),

    new HtmlWebpackPlugin({
      template: 'web/index.html',
      inject: 'body',
      filename: 'index.html',
      // chunksSortMode: 'dependency',
      // hash: true,
      // cache: false,
      // splash: fs.readFileSync('app/client/splash.html', 'utf-8'),
      // noscript: '<noscript><p> no script </p></noscript>',
      // csrf: '<%= csrf %>',
    }),

  ],

  // postcss: [autoprefixer({ browsers: ['last 2 versions'] })],

}


// additional webpack settings for local env (when invoked by 'npm start')
if (TARGET_ENV === 'development') {
  console.log('Serving locally...')

  // let LOCAL_IP = getLocalIp()


  module.exports = merge(commonConfig, {
    entry: {
      webpack: 'webpack-dev-server/client?http://localhost:8079',
      // hot: 'webpack/hot/only-dev-server',
    },

    // devServer: {
    //   // host: LOCAL_IP,
    //   inline: true,
    //   progress: true,
    //   // proxy: {
    //   //   '**': 'http://localhost:3111'
    //   // }
    // },
    cache: {},

    module: {
      loaders: [
        // {
        //   test: /\.(css|scss)$/,
        //   loaders: [
        //     'style-loader',
        //     'css-loader',
        //     'postcss-loader',
        //     'sass-loader'
        //   ]
        // }
      ]
    },

    plugins: [
      // new FlowtypePlugin(),
      // new webpack.HotModuleReplacementPlugin(),

      new webpack.DefinePlugin({
        '__DEV__': true,

        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
          '__DEV__': true,
        }
      }),

      // new WebpackMd5Hash(),

    ]
  })
}

// additional webpack settings for prod env (when invoked via 'npm run build')
if (TARGET_ENV === 'production') {
  console.log('Building for prod...')

  module.exports = merge(commonConfig, {
    module: {
      loaders: [
      ]
    },

    // resolve: {
    //   alias: {
    //     'react-native': 'react-native-web/src',
    //     // 'react': 'react/dist/react.min',
    //   }
    // },

    cache: {},

    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: '[name]-[chunkhash].js',
      // chunkFilename: '[chunkhash].js',
    },

    plugins: [

      new webpack.DefinePlugin({
        '__DEV__': false,

        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
          '__DEV__': false,
        }
      }),



      // extract CSS into a separate file
      // new ExtractTextPlugin({
      //   allChunks: true,
      //   filename: './[name]-[hash].css'
      // }),

      // new OptimizeCssAssetsPlugin(),
      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: { comments: false },
        // compressor: { warnings: true },
        compressor: { warnings: false },
        mangle: true
      }),

      new WebpackMd5Hash(),
    ]
  })
}

//
// if (!module.parent) {
//   // --- --- TODO: extending the webpack-dev-server here. --- --- //
//
//   var WebpackDevServer = require('webpack-dev-server')
//   var compiler = webpack(module.exports)
//   // var proxy = require('proxy-middleware')
//   var os = require('os')
//
//   if (process.env.LAN) {
//     createServer().listen(8079, getLocalIp(), function () {
//       console.log('Starting server on http://' + getLocalIp() + ':8079')
//     })
//   }
//   else {
//     createServer().listen(8079, '127.0.0.1', function () {
//       console.log('Starting server on http://localhost:8079')
//     })
//   }
//
// }
//
// function createServer () {
//   return new WebpackDevServer(compiler, {
//     stats: {
//       colors: true
//     },
//     // hot: true,
//     // proxy: {
//     //   '**': 'http://localhost:3111'
//     // },
//     setup: function (app) {
//       app.use(function (req, res, next) {
//
//         // TODO:
//         // if its index.html, use mustache and
//         // delivery the right file
//
//         // console.log('Using middleware for ' + req.url)
//         // console.log('-------------------------------------------------------------')
//         // console.log("ctx ", req)
//         next()
//       })
//
//       // app.use(proxy('http://127.0.0.1:3111'))
//
//     }
//   })
// }
//
// function getLocalIp () {
//   var interfaces = os.networkInterfaces()
//   var addresses = []
//   for (var k in interfaces) {
//     for (var k2 in interfaces[k]) {
//       var address = interfaces[k][k2]
//       if (address.family === 'IPv4' && !address.internal) {
//         addresses.push(address.address)
//       }
//     }
//   }
//
//   // console.log(addresses)
//   return addresses[0]
// }
//



  // // modifing default message
  // WebpackNotifierPlugin.prototype.compileMessage = function (stats) {
  //     var error;
  //     if (stats.hasErrors()) {
  //         error = stats.compilation.errors[0];
  //
  //     } else if (stats.hasWarnings() && !this.options.excludeWarnings) {
  //         error = stats.compilation.warnings[0];
  //
  //     } else if (this.options.alwaysNotify) {
  //     // } else if (!this.lastBuildSucceeded || this.options.alwaysNotify) {
  //         this.lastBuildSucceeded = true;
  //         return 'Build successful';
  //
  //     } else {
  //         return;
  //     }
  //
  //     this.lastBuildSucceeded = false;
  //
  //     var message;
  //     if (error.module && error.module.rawRequest)
  //         message = error.module.rawRequest + '\n';
  //
  //     if (error.error)
  //         message = 'Error: ' + message + error.error.toString();
  //     else if (error.warning)
  //         message = 'Warning: ' + message + error.warning.toString();
  //     else if (error.message) {
  //         message = 'Warning: ' + message + error.message.toString();
  //     }
  //
  //     return message
  //     // return stripANSI(message);
  // }

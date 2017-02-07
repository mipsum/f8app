import gulp from 'gulp'
// import { obj as thr } from 'through2'

// import path from 'path'

import gulpLoadPlugins from 'gulp-load-plugins'
// import { randomBytes } from 'crypto'

// import './assets'
// import './build'
// import './firebase'
// import './watchers'

const $ = gulpLoadPlugins()

const log = $.util.log
const red = $.util.colors.red
// const cyan = $.util.colors.cyan
// const green = $.util.colors.green
// const mag = $.util.colors.magenta
// const bold = $.util.colors.bold

gulp.task('default', $.shell.task(`
  source ./env.sh

  export TARGET_ENV='build'
  rm -rf web/dist/*
  mkdir -p web/dist/gz

  webpack --output-path web/dist/

  cd web/dist
  find . -type f | grep '.js$' | while read file; do tar cvzf "gz/$file.gz" "$file"; done
`))

gulp.task('ios-packager', $.shell.task(`
  source ./env.sh

  react-native start --reset-cache
`))


gulp.task('android-packager', $.shell.task(`
  source ./env.sh

  react-native start --reset-cache --port 8082
`))

gulp.task('web-packager', $.shell.task(`
  source ./env.sh

  # webpack-dev-server -d --inline --hot --progress --port 8079
  webpack-dev-server --debug --devtool source-map --output-pathinfo --inline --progress --port 8079
`))

gulp.task('android-ports', $.shell.task(`
  adb reverse tcp:8082 tcp:8082 &&
  adb reverse tcp:8081 tcp:8081 &&
  adb reverse tcp:8080 tcp:8080
`))

gulp.task('android-emu', $.shell.task(`
  source ./env.sh

  react-native run-android && gulp android-ports

    sleep 100000000 # the goal is to keep the process
`))


gulp.task('ios-emu', $.shell.task(`
  source ./env.sh

  react-native run-ios

  sleep 100000000 # the goal is to keep the process runnig still
`))

gulp.task('nexus', $.shell.task(`
  source ./env.sh

  emulator @nexus5 || echo "Do you have created a emulator named 'nexus5' ?\n"
`))

gulp.task('patch-android', $.shell.task(`
  source ./env.sh

  mkdir -p ./android/app/build/intermediates/res/merged/debug
`))

gulp.task('clean-tasks', $.shell.task(`
  source ./env.sh


  pkill -f /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/Contents/MacOS/Simulator

  pm2 stop all
  sleep 1

  pm2 delete all
  pm2 flush
  rm -rf ~/.pm2/logs/*

  pm2 kill

  sleep 1

  watchman watch-del-all
  rm -fr $TMPDIR/react-*

`))


gulp.task('mongod', $.shell.task(`
  source ./env.sh

  mongod -v --config ./mongod.conf
`))

gulp.task('express', $.shell.task(`
  source ./env.sh

  babel-node ./server/server.js
`))

gulp.task('pm2-dev', $.shell.task(`
  source ./env.sh

  pm2 -f start tasks/run.sh --name="nexus" -- gulp nexus

  gulp patch-android
  (sleep 30 && pm2 -f start tasks/run.sh --name="android-emu" -- gulp android-emu) &
  pm2 -f start tasks/run.sh --name="android-packager" --watch "./rn-cli.config" -- gulp android-packager

  (sleep 15 && pm2 -f start tasks/run.sh --name="ios-emu" -- gulp ios-emu) &
  pm2 -f start tasks/run.sh --name="ios-packager" --watch "./rn-cli.config" -- gulp ios-packager

  pm2 -f start tasks/run.sh --name="web-packager" --watch ./webpack.config.js -- gulp web-packager

  pm2 -f start tasks/run.sh --name="mongod" --watch ./mongod.conf -- gulp mongod
  pm2 -f start tasks/run.sh --name="express" --watch ./server/server.js -- gulp express

  pm2 logs --raw
`))

gulp.task('restart', $.shell.task(`
  source ./env.sh

  pm2 restart all
`))

// gulp.task('rename-app', done => {
//   if (!process.env.NAME) {
//     let err = 'must provide a new app name'
//     log(red(`${err}: NAME=some-new-name gulp rename-app`))
//     return done(err)
//   }
//
//   let appName = process.env.NAME
//   let coName = 'our-co-name'
//
//   return $.shell.task(`
//     source ./env.sh
//
//     sed -e 's;"name"..*;"name": "${appName}",;' -i.bak package.json &&
//     rm -rf package.json.bak &&
//
//     cd app/cordova &&
//     cordova platform remove ios &&
//
//     sed -e 's;<widget id="[^ ][^ ]* ;<widget id="com.${coName}.${appName}" ;'  \
//       -e 's;<name>.*</name>;<name>${appName}</name>;'  -i.bak config.xml &&
//
//
//     cordova platform add ios &&
//
//     rm -rf config.xml.bak
//   `)(done)
// })


// gulp.task('dev', gulp.series('clean-tasks', 'clean', 'build', gulp.parallel('pm2-dev', 'run-ios')))

// gulp.task('dev-lan', $.shell.task(`
//   source ./env.sh
//
//   export LAN=true
//   gulp dev
// `))

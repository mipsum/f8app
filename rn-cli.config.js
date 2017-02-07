let blacklist = require('react-native/packager/blacklist')

let config = {
  getBlacklistRE () {
    return blacklist([
      /webpack.config.js/,
      /rn-cli.config.js/,
      // /package.json/,
      /tasks\/.*/,
      /web\/.*/
      // /node_modules\/.*/,
      // /server\/.*/,
    ])
  }
}

module.exports = config

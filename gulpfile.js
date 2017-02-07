require('babel-register')({
  presets: ['es2015-node', 'stage-3']
})

// TODO: have a different entry for prod
require('./tasks')

const path = require('path')
const name = 'Djing2 ui'

module.exports = {
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  pwa: {
    name: name
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // Provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.frag$/,
          loader: 'glsl-vue-loader'
        }
      ]
    }
  }
}

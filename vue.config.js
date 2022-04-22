// vue.config.js
module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
        .loader('vue-svg-inline-loader')
        .end()
  },
  css: { extract: false },
}

// vue.config.js
module.exports = {
  chainWebpack: config => {
    // vue svg inline loader for default svg
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
        .loader('vue-svg-inline-loader')
        .end()
  },
}

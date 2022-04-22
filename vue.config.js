// vue.config.js
module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('svg')
      .test(/\.(svg)$/i)
      .use('svg-inline-loader')
        .loader('svg-inline-loader')
        .end()
  },
  css: { extract: false },
}

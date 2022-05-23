// vue.config.js
module.exports = {
  chainWebpack: config => {
    // vue svg inline loader for default svg
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
        .loader('vue-svg-inline-loader')
        .end()
    const fontsRule = config.module.rule('fonts')
    fontsRule.uses.clear()
    config.module
      .rule('fonts')
      .test(/\.(ttf|otf|eot|woff|woff2)$/)
      .use('base64-inline-loader')
      .loader('base64-inline-loader')
      .tap(options => {
        // modify the options...    
        return options
      })
      .end()
  }
}

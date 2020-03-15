const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '/imall': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/imall': '',
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        styles: '@/assets/styles',
        images: '@/assets/images',
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        resources: ['~styles/variables.less'],
      },
    },
  },
  publicPath: isProduction ? '' : '',
  productionSourceMap: false,
};

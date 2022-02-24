/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/public/': {
      target: 'http://192.168.1.97:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/images/': {
      target: 'http://192.168.1.97:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/ctl/': {
      target: 'http://192.168.1.97:8000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/ctl/': {
      target: 'http://plus-test.2856mall.com/operating_panel',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',  // 이 부분은 그대로 유지
      },
    })
  );
};
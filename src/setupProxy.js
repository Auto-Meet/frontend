const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/login", "/api"], {
      target: "http://43.200.237.37:8080",
      changeOrigin: true,
      logLevel: "debug", // 디버깅을 위한 로그 레벨 설정
    })
  );

  app.use(function (request, response, next) {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });
};

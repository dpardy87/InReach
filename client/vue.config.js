const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backendx``
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: true,
});

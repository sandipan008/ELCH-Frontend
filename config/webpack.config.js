const path = require("path");

const config = require("./site.config");
const loaders = require("./webpack.loaders");
const plugins = require("./webpack.plugins");

module.exports = {
  context: path.join(config.root, config.paths.src),
  entry: [
    path.join(config.root, config.paths.src, "scripts.js"),
    path.join(config.root, config.paths.src, "styles.scss"),
  ],
  output: {
    path: path.join(config.root, config.paths.dist),
    publicPath: "auto",
    filename: "[name].[hash].js",
  },
  mode: ["production", "development"].includes(config.env)
    ? config.env
    : "development",
  // devtool: config.env === "production" ? "hidden-source-map" : "",
  devServer: {
    hot: true,
    open: true,
    port: config.port,
    host: config.dev_host,
  },
  module: {
    rules: loaders,
  },
  plugins,
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = require("./site.config");

// Define common loader constants
const sourceMap = config.env !== "production";

// HTML loaders
const html = {
  test: /\.(html)$/,
  use: [
    {
      loader: "html-loader",
      options: {
        // interpolate: true,
      },
    },
  ],
};

// HBS loaders
const hbs = {
  test: /\.handlebars$/,
  loader: "handlebars-loader",
};

// Javascript loaders
const js = {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
    // "eslint-loader",
  ],
};

// Style loaders
const styleLoader = {
  loader: "style-loader",
};

const cssLoader = {
  loader: "css-loader",
  options: {
    sourceMap: true,
    // importLoaders: 1,
    // modules: true,
  },
};

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        [
          "autoprefixer",
          {
            sourceMap: true,
          },
        ],
      ],
    },
  },
};

const cssFileLoader = {
  test: /\.css$/,
  loader: "file-loader",
  options: {
    outputPath: "css",
  },
};

const css = {
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, cssLoader, postcssLoader],
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    cssLoader,
    postcssLoader,
    {
      loader: "sass-loader",
      options: {
        sourceMap,
      },
    },
  ],
};

// Image loaders
const imageLoader = {
  loader: "image-webpack-loader",
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: "65-90",
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(png|jpg|gif|svg)$/,
  type: "asset/resource",
  exclude: /fonts/,
};

// Font loaders
const fonts = {
  test: /\.(eot|ttf|woff)$/,
  type: "asset/resource",
};

module.exports = [html, hbs, js, css, cssFileLoader, sass, images, fonts];

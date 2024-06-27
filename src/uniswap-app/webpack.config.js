const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "uniswap.js",
    path: path.resolve(__dirname, "..", "..", "docs", "uniswap-app")
  }
};
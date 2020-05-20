require("dotenv").config();
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")(["monaco-editor"]);
const webpack = require("webpack");

module.exports = withTM({
  webpack(config) {
    const rule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        (r) =>
          // Find the global CSS loader
          r.issuer && r.issuer.include && r.issuer.include.includes("_app")
      );
    if (rule) {
      rule.issuer.include = [
        rule.issuer.include,
        // Allow `monaco-editor` to import global CSS:
        /[\\/]node_modules[\\/]monaco-editor[\\/]/,
      ];
    }

    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [
          "typescript",
          "javascript",
          "python",
          "cpp",
          "java",
          "objective-c"
        ],
        filename: "static/[name].worker.js",
      })
    );
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
});

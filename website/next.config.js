require("dotenv").config();

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/server/));
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
};

const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'babel-plugin-r': require.resolve('./babel-plugin-r.js'),
};

module.exports = config;

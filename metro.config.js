const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'react-native': require.resolve('react-native-web'),
    '@react-native/assets-registry/registry': require.resolve('expo-asset/build/registry'),
  },
  blockList: [
    ...config.resolver.blockList,
    /\/node_modules\/.*\/node_modules\/react-native\/.*/,
  ],
  resolverMainFields: ['react-native', 'browser', 'main'],
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg']
};

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-web/dist/transformer')
};

module.exports = config;

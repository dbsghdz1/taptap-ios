const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  watchFolders: [__dirname],
  resolver: {
    blockList: [/TapTap\/Tuist\/\.build\/.*/, /TapTap\/Pods\/.*/, /TapTap\/Projects\/.*\/Derived\/.*/],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

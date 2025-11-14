// this configuration sets up Babel to use the Expo preset, which is optimized for React Native projects using Expo.
module.exports = function (api) {
    api.cache(true);
    return { presets: ['babel-preset-expo'] };
  };

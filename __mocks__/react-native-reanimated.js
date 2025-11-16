// mocking react-native-reanimated for testing purposes
const Reanimated = require('react-native-reanimated/mock');
Reanimated.default.call = () => {}; // silence useNativeDriver warning
module.exports = Reanimated;

// jest configuration for a React Native project using Expo
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(?:react-native|@react-native|react-native-.*|react-native-web|@react-navigation/.*|expo(nent)?|@expo(nent)?/.*|@expo/vector-icons|expo-router|@testing-library/.*))',
    ],
    // mock static assets and specific modules
    moduleNameMapper: {
      '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
  
      '^react-native-paper$': '<rootDir>/__mocks__/react-native-paper.js',
      '^expo-router$': '<rootDir>/__mocks__/expo-router.js',
      '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
      '^react-native-worklets$': '<rootDir>/__mocks__/react-native-worklets.js',
    },
    testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
    cacheDirectory: '<rootDir>/.jest-cache',
  };
  
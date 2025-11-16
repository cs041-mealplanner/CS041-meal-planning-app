import '@testing-library/jest-native/extend-expect';

// mock fetch globally to avoid unhandled fetch calls during tests
if (typeof global.fetch === 'undefined') {
  global.fetch = (...args) => Promise.reject(new Error('fetch not mocked: ' + JSON.stringify(args)));
}

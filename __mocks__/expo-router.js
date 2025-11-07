// mock implementation of expo-router for testing purposes
export const useRouter = () => ({ push: jest.fn(), replace: jest.fn() });
export const useLocalSearchParams = () => ({});
export const Link = ({ children }) => children;
export default {};

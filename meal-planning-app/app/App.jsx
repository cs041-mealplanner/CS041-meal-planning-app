import { Provider as PaperProvider } from 'react-native-paper';


export default function App() {
  return (
    <PaperProvider>
      <Home />
      <App />
    </PaperProvider>
  );
}

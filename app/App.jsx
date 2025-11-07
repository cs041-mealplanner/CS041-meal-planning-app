import { Provider as PaperProvider } from 'react-native-paper';
import Home from './index.jsx';


export default function App() {
  return (
    <PaperProvider>
      <Home />
      <App />
    </PaperProvider>
  );
}

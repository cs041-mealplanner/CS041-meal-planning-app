import { Amplify } from 'aws-amplify';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import outputs from '../amplify_outputs.json';
import App from './App.jsx';
import './index.css';

Amplify.configure(outputs);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

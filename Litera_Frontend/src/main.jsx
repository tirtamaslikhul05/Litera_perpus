import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Mengandung instruksi utility classes Tailwind @tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
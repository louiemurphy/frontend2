import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Assuming your App component is in App.js
import './index.css';  // If you have a global CSS file

// Create the root for React 18 rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

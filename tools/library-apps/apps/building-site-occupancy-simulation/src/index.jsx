import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../../src/common/index.css';
import App from './App';
import reportWebVitals from '../../../src/common/reportWebVitals';

// Create the React root and render our application.  We wrap the
// component in <React.StrictMode> to surface potential problems
// during development.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Pass a no‑op function to reportWebVitals so that the default
// analytics code is loaded without logging any metrics.  Comment
// this line out and pass a function if you wish to measure web
// performance.
reportWebVitals();
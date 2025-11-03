import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-router-dom';

const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found');
} else {
  ReactDOM.createRoot(root).render(
  
      <App />
   
  );
}

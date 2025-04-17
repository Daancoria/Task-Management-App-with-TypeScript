import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { TaskProvider } from './context/TaskContext';

// Retrieve Auth0 configuration from environment variables
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// Log Auth0 configuration for debugging purposes
console.log("Auth0 domain:", domain);
console.log("Auth0 clientId:", clientId);

// Render the root React component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap the application with Auth0Provider for authentication */}
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin, // Redirect to the app's root after login
      }}
    >
      {/* Wrap the application with TaskProvider to manage task-related state */}
      <TaskProvider>
        {/* Main application component */}
        <App />
      </TaskProvider>
    </Auth0Provider>
  </React.StrictMode>
);

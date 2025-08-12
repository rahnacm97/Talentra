import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppWrapper />
    </GoogleOAuthProvider>    
  </React.StrictMode>
);
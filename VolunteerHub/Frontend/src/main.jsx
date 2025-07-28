import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';  
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './store/index.jsx';   

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>          
      <GoogleOAuthProvider clientId="6332882025-tl8j43i3hdema55a26e92qiqajgp6k0b.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);

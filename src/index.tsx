import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import ApolloWrapper from './ApolloClient/Connect/Connect';
import store from './Redux/store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloWrapper>
        <App />
        <ToastContainer />
      </ApolloWrapper>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

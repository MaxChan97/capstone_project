import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";

// react-alert imports
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// Redux Imports
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import allReducers from "./redux/reducers";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//Font Awesome
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
//Theme style (comes with Bootstrap css)
import "admin-lte/dist/css/adminlte.min.css";
import jquery from "jquery";
window.$ = window.jQuery = jquery;
//AdminLTE script
//we have to use the require() instead of ES6 import here
//this is because import statements should be before any codes but
//since AdminLTE requires jQuery to work properly, we can’t use the
//import syntax
require("admin-lte/dist/js/adminlte.min");

// Redux stuff
const persistConfig = {
  key: "reducer",
  storage: storage,
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, allReducers);
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
const persistor = persistStore(store);

// react-alert stuff
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <React.StrictMode>
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </React.StrictMode>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from 'redux-thunk';

import App from "./Components/App";
import reducers from './reducers';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Amplify, API, graphqlOperation, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const user =  Auth.currentAuthenticatedUser().then(data=>{
  const groups = data.signInUserSession.accessToken.payload["cognito:groups"];
  console.log(groups);
  console.log(data);
});

if(!localStorage.getItem('ids')) localStorage.setItem("ids",JSON.stringify(["id","title","country","description","image","images","options","ratings","price","oldPrice","avgRating"]));
if(!localStorage.getItem('type')) localStorage.setItem("type","products");

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

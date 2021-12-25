import React from 'react';
// import registerRootComponent from "expo/build/launch/registerRootComponent";

import Provider from './store/Provider';
import Router from './Router';

export default function App() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}

// registerRootComponent(App);

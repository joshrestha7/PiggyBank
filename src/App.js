import './App.css';
import Amplify from 'aws-amplify';
import config from './aws-exports'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import React from 'react';
import Start from './components/Start';

Amplify.configure(config)

function App() {
  return (
    <div className="App">
        <Start />
        <AmplifySignOut/>
    </div>
  );
}

export default withAuthenticator(App);

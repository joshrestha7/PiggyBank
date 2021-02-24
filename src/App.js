import './App.css';
import Amplify, {API, Auth} from 'aws-amplify';
import config from './aws-exports'
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react'
import { useEffect } from 'react';

Amplify.configure(config)

function App() {
  useEffect(()=>{

    Auth.currentAuthenticatedUser().then((user) => {
      API.post('piggybankapi', '/create-link-token', {
        body: {
          id: user.attributes.sub
        }
      }).then(data => console.log(data), err=>console.log(err));
    });
  });
  return (
    <div className="App">
      <header className="App-header">
        Hello
        <AmplifySignOut/>
      </header>
    </div>
  );
}

export default withAuthenticator(App);

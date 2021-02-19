import './App.css';
import Amplify from 'aws-amplify';
import config from './aws-exports'
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react'

Amplify.configure(config)

function App() {
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

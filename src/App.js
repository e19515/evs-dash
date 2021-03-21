import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <AmplifyAuthenticator>
      { /* Present the actual dashboard */ }
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn React
          </a>
          <AmplifySignOut />
        </header>
      </div>

      { /* AmplifySignIn simplified for demo use */ }
      <AmplifySignIn
        slot="sign-in"
        headerText="Sign in to ChargePoint dashboard"
        formFields={[
          {
            type: "username",
            label: "Username",
            placeholder: "evsdemo",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "evsdemo1",
            required: true,
          },
        ]}
        hideSignUp="true"
      />
      
      { /* AmplifySignUp house-keeping, unimportant */ }
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          {
            type: "username",
            label: "Username",
            placeholder: "evsdemo",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "evsdemo1",
            required: true,
          },
        ]} 
      />
    </AmplifyAuthenticator>
  );
}

export default App;

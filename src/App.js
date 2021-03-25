//import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import {AuthState} from "@aws-amplify/ui-components";
import Helmet from "react-helmet";
import { useState, useEffect } from 'react';
import useInterval from 'use-interval';

import { fetchDashboard, isSignedIn } from './Api';
import ChargePointTable from './ChargePointTable';

function App() {
  const [data, setData] = useState([{FriendlyName: 'loading...'}])
  
  const refreshDashboard = function() {
    if (isSignedIn()) {
      fetchDashboard().then( result => {
        console.debug(result);
        setData(result.data);
      }, apiReason => {
        console.error(apiReason);
      })
    }
  }
  
  // fetchDashboardAPI on signedIn
  const handleAuthStateChange = (nextAuthState) => {
    if (nextAuthState === AuthState.SignedIn) {
      refreshDashboard();
    }
  };
  // fetchDashboardAPI using the effect Hook, similar to componentDidMount (already signedIn)
  useEffect( () => { 
    refreshDashboard();
  }, []);
  // fetchDashboardAPI every 30s
  useInterval( () => {
    refreshDashboard();
  }, 30*1000/* ms */);

  return (
    <AmplifyAuthenticator handleAuthStateChange={handleAuthStateChange}>
      {/* Present the actual Dashboard, apply Bootstrap layout */}
      <div className="App container-fluid">
        <Helmet>
          <title>ChargePoint - EVS dashboard</title> 
          {/* FIXME: AmplifyAuthenticator conflict */}
        </Helmet>
        <div className="row my-3">
          <div className="col-md-9 col-sm-8">
            <h1>
              ChargePoint&nbsp;
              <br className="d-md-none" />
              <small className="text-muted">EVS dashboard</small>
            </h1>
          </div>
          <div className="col-md-3 col-sm-4">
            <AmplifySignOut />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ChargePointTable
              data={data}
            />
          </div>
        </div>
      </div>

      {/* AmplifySignIn watered down for demo use */}
      <AmplifySignIn
        slot="sign-in"
        headerText="Sign in to EVS dashboard"
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
      /> {/* NOTE: SignUp backend requires manual confirmation via aws congnito console so it's hidden */}
    </AmplifyAuthenticator>
  );
}

export default App;

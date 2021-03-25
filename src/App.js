//import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import {AuthState} from "@aws-amplify/ui-components";
import Helmet from "react-helmet";
import { API, Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import useInterval from 'use-interval';

import ChargePointTable from './ChargePointTable';

function App() {
  const [data, setData] = useState([{FriendlyName: 'loading...'}])
  
  const fetchDashboardAPI = async function() {
    const apiName = 'ChargePoint';
    const path = '/dashboard';

    Auth.currentAuthenticatedUser().then( cognitoUser =>{
      API.get(apiName, path).then( result => {
        console.debug(result.chargePoints);
        setData(result.data);
      }, apiReason => {
        console.error(apiReason);
      })
    }, authReason => {
      console.log(authReason);
    })
  }
  
  // fetchDashboardAPI on signedIn
  const handleAuthStateChange = (nextAuthState) => {
    if (nextAuthState === AuthState.SignedIn) {
      fetchDashboardAPI();
    }
  };
  // fetchDashboardAPI using the effect Hook, similar to componentDidMount (already signedIn)
  useEffect( () => { 
    fetchDashboardAPI();
  }, []);
  // fetchDashboardAPI every 30s
  useInterval( () => {
    fetchDashboardAPI();
  }, 30*1000/* ms */);

  return (
    <AmplifyAuthenticator handleAuthStateChange={handleAuthStateChange}>
      {/* Present the actual Dashboard, apply Bootstrap layout */}
      <div className="App container-fluid">
        {/* FIXME: AmplifyAuthenticator conflict */}
        <Helmet>
          <title>ChargePoint - EVS dashboard</title> 
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


          <ChargePointTable
            data={data}
          />

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

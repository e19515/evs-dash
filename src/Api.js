import Amplify, {API, Auth} from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
Auth.configure({ ...awsExports, authenticationFlowType: "USER_PASSWORD_AUTH" }); /* enabled via AWS Cognito console */

const username = 'evsdemo'
const password = 'evsdemo1'
const apiName = 'ChargePoint';
const chargePointPath = '/chargePoints';
const dashboardPath = '/dashboard';

function signIn() {
  return Auth.signIn(username, password)
}

async function isSignedIn() {
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return (cognitoUser.username == username);
}

function fetchDashboard() {
  return API.get(apiName, dashboardPath)
}

function postChargePoint( chargePoint ) {
  return API.post(
    apiName,
    chargePointPath,
    {
      body: chargePoint,
    },
  )
}

function getChargePoint( chargePoint ) {
  return API.get(
    apiName,
    chargePointPath + '/' + chargePoint.PointId,
  )
}

function deleteChargePoint( chargePoint ) {
  return API.del(
    apiName,
    chargePointPath + '/' + chargePoint.PointId,
    {
      body: chargePoint,
    },
  )
}

function patchChargePoint( chargePoint ) {
  return API.patch(
    apiName,
    chargePointPath + '/' + chargePoint.PointId,
    {
      body: chargePoint,
    },
  )
}

export { signIn, isSignedIn, fetchDashboard, postChargePoint, getChargePoint, deleteChargePoint, patchChargePoint};
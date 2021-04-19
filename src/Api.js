import Amplify, {API, Auth} from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
Auth.configure({ ...awsExports, authenticationFlowType: "USER_PASSWORD_AUTH" }); /* enabled via AWS Cognito console */

const username = 'evsdemo'
const password = 'evsdemo1'
const apiName = 'ChargePoint';
const chargePointsPath = '/chargePoints';
const dashboardPath = '/dashboard';

function pathFromChargePoint(chargePoint) {
  return chargePointsPath + '/' + chargePoint.PointId
}

function signInAsDemo() {
  return Auth.signIn(username, password)
}

async function isSignedIn() {
  return Auth.currentAuthenticatedUser().then( cognitoUser => {
    return (cognitoUser.username.length >= 1);
  }, authReason => {
    console.log(authReason);
    return false;
  })
}

function fetchDashboard() {
  return API.get(apiName, dashboardPath)
}

function postChargePoint( chargePoint ) {
  return API.post(
    apiName,
    chargePointsPath,
    {
      body: chargePoint,
    },
  )
}

function getChargePoint( chargePoint ) {
  return API.get(
    apiName,
    pathFromChargePoint(chargePoint),
  )
}

function deleteChargePoint( chargePoint ) {
  return API.del(
    apiName,
    pathFromChargePoint(chargePoint),
    {
      body: chargePoint,
    },
  )
}

function patchChargePoint( chargePoint ) {
  return API.patch(
    apiName,
    pathFromChargePoint(chargePoint),
    {
      body: chargePoint,
    },
  )
}

export { signInAsDemo, isSignedIn, fetchDashboard, postChargePoint, getChargePoint, deleteChargePoint, patchChargePoint};
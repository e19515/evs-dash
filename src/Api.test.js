global.crypto = require('crypto')
/* There's a bug in amazon-cognito-identity-js, see ./patches/amazon-cognito-identity-js+4.6.0.patch */

import { bakeValidTestItem, bakeInvalidTestItem} from './testdata';

import Amplify, {API, Auth} from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
Auth.configure({ ...awsExports, authenticationFlowType: "USER_PASSWORD_AUTH" }); /* enabled via AWS Cognito console */

const username = 'evsdemo'
const password = 'evsdemo1'
const apiName = 'ChargePoint';
const chargePointPath = '/chargePoints';
const dashboardPath = '/dashboard';


describe('Auth.signIn give us authorization to the API', () => {
  it("sign in as predefined user", async () => {
    const cognitoUser = await Auth.signIn(username, password)

    expect(cognitoUser.username).toEqual(username);
  })
})

describe('currentAuthenticatedUser return cognitoUser if SignedIn', () => {
  it("should have the predefined username as username", () => {
    return Auth.currentAuthenticatedUser().then( cognitoUser =>{
      expect(cognitoUser.username).toEqual(username);
    }, authReason => {
      console.error(authReason);
    })
  })
})

describe('fetch dashboard API', () => {
  it("should return a list of chargePoints", async () => {
    return API.get(apiName, dashboardPath).then( result => {
      expect( result.count ).toBeGreaterThanOrEqual(1);
    }, apiReason => {
      console.error(apiReason);
    })
  })
})


/* ValidTestItem */
describe('CRUD ValidTestItem', () => {
  const testItem = bakeValidTestItem();

  test("Create", async () => {
    return API.post(
        apiName,
        chargePointPath,
        { body: testItem,}
      ).then( result => {
        expect( result.data[0] ).toEqual( testItem );
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("Read", async () => {
    return API.get(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      ).then( result => {
        expect( result.data[0] ).toEqual( testItem );
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("Update", async () => {
    testItem.StateOfCharge = 100; // It charges.
    return API.patch(
        apiName,
        chargePointPath + "/" + testItem.PointId,
        { body: testItem,}
      ).then( result => {
        expect( result.data[0] ).toEqual( testItem );
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("Delete", async () => {
    return API.del(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      ).then( result => {
        expect( result.success ).toEqual('ChargePoint "'+testItem.PointId+'" has been deleted.');
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("Read after Deletion",  () => {
    return expect(
      API.get(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      )
    ).rejects.toThrow(
     'Request failed with status code 404',
    )
  })
})


/* InvalidTestItem */
describe('Create InvalidTestItem', () => {
  const testItem = bakeInvalidTestItem();

  it("should fail",  () => {
    return expect(
      API.post(
        apiName,
        chargePointPath,
        { body: testItem,}
      )
    ).rejects.toThrow(
     'Request failed with status code 409',
    )
  })
})
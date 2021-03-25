global.crypto = require('crypto')
/* There's a bug in amazon-cognito-identity-js, see ./patches/amazon-cognito-identity-js+4.6.0.patch */

import { bakeValidTestItem, bakeInvalidTestItem, bakeItemsForPopulation} from './testdata';

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
  it("should return a list of chargePoints", () => {
    return API.get(apiName, dashboardPath).then( result => {
      expect( result.count ).toBeGreaterThanOrEqual(1);
    }, apiReason => {
      console.error(apiReason);
    })
  })
})


/* ValidTestItem */
/* checklist from an article "What to test on your CRUD REST API" */
describe('CRUD checklist ValidTestItem', () => {
  const testItem = bakeValidTestItem();

  test("should create a resource (Create)", () => {
    return API.post(
        apiName,
        chargePointPath,
        { body: testItem,}
      ).then( result => { // TODO: Can I access HTTP status code?
        expect( result.data[0] ).toEqual( testItem );
    }, apiReason => {
      console.error(apiReason);
    })
  })

  it("should return a specific resource (Read)", () => {
    return API.get(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      ).then( result => {
        expect( result.data[0] ).toEqual( testItem );
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("should update the resource (Update)", () => {
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

  test("should delete the resource (Delete)", () => {
    return API.del(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      ).then( result => {
        expect( result.success ).toEqual('ChargePoint "'+testItem.PointId+'" has been deleted.');
    }, apiReason => {
      console.error(apiReason);
    })
  })

  test("should return a 404 if resource not found (Update after Deletion)",  () => { // SHOULD FAIL
    return expect(
      API.patch(
        apiName,
        chargePointPath + "/" + testItem.PointId,
        { body: testItem,}
      )
    ).rejects.toThrow(
     'Request failed with status code 404',
    )
  })

  test("should return a 404 if resource not found (Read after Deletion)",  () => {
    return expect(
      API.get(
        apiName,
        chargePointPath + "/" + testItem.PointId,
      )
    ).rejects.toThrow(
     'Request failed with status code 404',
    )
  })

  test("should do nothing (Delete non-existent resource)",  () => { // SHOULD FAIL
    return API.del(
      apiName,
      chargePointPath + "/" + "I-DO-NOT-EXIST",
    ).then( result => {
      expect( result.success ).toEqual('ChargePoint "I-DO-NOT-EXIST" does not exist.');
    }, apiReason => {
      console.error(apiReason);
    })
  })
})


/* InvalidTestItem */
describe('Create InvalidTestItem', () => {
  const testItem = bakeInvalidTestItem();

  it("should fail if StateOfCharge is invalid (Create)",  () => {
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

/* populate Dynamodb */
/*describe.each(
  bakeItemsForPopulation(10)
)('populate Dynamodb', testItem => {
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
})*/
global.crypto = require('crypto')
/* There's a bug in amazon-cognito-identity-js, see ./patches/amazon-cognito-identity-js+4.6.0.patch */

import { bakeValidTestItem, bakeInvalidTestItem, bakeItemsForPopulation} from './testdata';

import { signInAsDemo, isSignedIn, fetchDashboard, postChargePoint, getChargePoint, deleteChargePoint, patchChargePoint} from './Api';

describe('signInAsDemo give us authorization to the API', () => {
  it("sign in as predefined user 'evsdemo'", async () => {
    const cognitoUser = await signInAsDemo();
    expect( cognitoUser.username ).toEqual('evsdemo');
  })
})

describe('isSignedIn checks signin status', () => {
  it("should return true", async () => {
    const result = await isSignedIn();
    expect( result ).toBeTruthy();
  })
})

describe('fetch dashboard API', () => {
  it("should return a list of chargePoints", () => {
    return fetchDashboard().then( result => { // TODO: Can I access HTTP status code?
        expect( result.count ).toBeGreaterThanOrEqual(1);
    })
  })
})


/* ValidTestItem */
/* checklist from an article "What to test on your CRUD REST API" */
describe('CRUD checklist ValidTestItem', () => {
  const testChargePoint = bakeValidTestItem();

  it("should create a resource (Create)", () => {
    return postChargePoint(testChargePoint).then( result => { // TODO: Can I access HTTP status code?
        expect( result.data[0] ).toEqual( testChargePoint );
    })
  })

  it("should return a specific resource (Read)", () => {
    return getChargePoint(testChargePoint).then( result => {
      expect( result.data[0] ).toEqual( testChargePoint );
    })
  })

  it("should update the resource (Update)", () => {
    testChargePoint.StateOfCharge = 100; // It charges.
    return patchChargePoint(testChargePoint).then( result => {
      expect( result.data[0] ).toEqual( testChargePoint );
    })
  })

  it("should delete the resource (Delete)", () => {
    return deleteChargePoint(testChargePoint).then( result => {
      expect( result.success ).toEqual( 'ChargePoint "'+testChargePoint.PointId+'" has been deleted.' );
    })
  })

  it.skip("should return a 404 if resource not found (Update after Deletion)",  () => {  // SHOULD FAIL
    return expect( patchChargePoint(testChargePoint) ).rejects.toThrow(
      'Request failed with status code 404',
    )
  })

  it("should return a 404 if resource not found (Read after Deletion)",  () => {
    return expect( getChargePoint(testChargePoint) ).rejects.toThrow(
      'Request failed with status code 404',
    )
  })

})

describe.skip('CRUD checklist non-existent', () => {
  const testChargePoint = bakeValidTestItem();

  it("should do nothing (Delete non-existent resource)", () => {  // SHOULD FAIL
    return deleteChargePoint(testChargePoint).then( result => {
      expect( result.success ).toEqual( 'ChargePoint "'+testChargePoint.PointId+'" does not exist.' );
    })
  })
})



/* InvalidTestItem */
describe('Create InvalidTestItem', () => {
  const testChargePoint = bakeInvalidTestItem();
  it("should fail if StateOfCharge is invalid (Create)",  () => {
    return expect( postChargePoint(testChargePoint) ).rejects.toThrow(
      'Request failed with status code 409',
    )
  })

})

/* populate Dynamodb */
/*describe.skip.each(
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
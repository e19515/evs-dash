/*
  ChargePoint API

  Keep it simple.
  
  GET /dashboard
  POST /chargePoints
  GET /chargePoints/$PointId
  PATCH /chargePoints/$PointId
  DELETE /chargePoints/$PointId
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "ChargePoint";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const partitionKeyName = "PointId";
const chargePointsPath = "/chargePoints";
const dashboardPath = "/dashboard";
const hashKeyPath = '/:' + partitionKeyName;
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/*  GET /dashboard  */
app.get(dashboardPath , function(req, res) {
  var params = {
    TableName: tableName ,
    ProjectionExpression: 'SiteDescription, FriendlyName, StateOfCharge',
    Limit: 100 // scan the whole table, up to 100 items
  };

  console.log("Scanning ChargePoint table.");
  dynamodb.scan(params, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      console.log("Scan succeeded.");
      res.json(
        {
          success: 'dashboard update fetched.',
          data: data.Items,
          count: data.Count
        }
      );
      // TODO: (?) add continue scanning
    }
  });
});

const checkPercentage = (percentage) => {
  return ( Number.isInteger(percentage) && ( 0 <= percentage===percentage <= 100 ) );
}

/*  POST /chargePoints  */
app.post(chargePointsPath, function(req, res) {

  if (! checkPercentage(req.body.StateOfCharge)) {
    res.statusCode = 409;
    res.json({error: "The percentage is wrong."});
    return;
  }

  let putItemParams = {
    TableName: tableName,
    ConditionExpression: "attribute_not_exists(PointId)",
    Item: req.body
  }
  dynamodb.put(putItemParams, (err) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.statusCode = 201;
      //res.location();
      res.json(
        {
          success: 'A new ChargePoint has been created.',
          data: [req.body,]
        }
      );
    }
  });
});

/*  GET /chargePoints/$PointId  */
app.get(chargePointsPath + hashKeyPath , function(req, res) {
  let params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.statusCode = 200;
        res.json({
          data: [data.Item] // keep it uniform because this is small-scale
        });
      } else {
        res.statusCode = 404;
        res.json({}) ;
      }
    }
  });
});

/*  PATCH /chargePoints/$PointId  */
app.patch(chargePointsPath + hashKeyPath , function(req, res) {

    // TODO: (?) checkPercentage etc 

  if (req.params[partitionKeyName] == req.body[partitionKeyName]) {
    let putItemParams = {
      TableName: tableName,
      ConditionExpression: "attribute_exists(PointId)",
      Item: req.body
    }
    dynamodb.put(putItemParams, (err) => {
      if(err) {
        res.statusCode = 500;
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.statusCode = 200;
        //res.location();
        res.json(
          {
            data: [req.body,]
          }
        );
      }
    });
  } else {
    res.statusCode = 409;
    res.json({params: req.params, url: req.url, body: req.body});
  }
});

/*  DELETE /chargePoints/$PointId  */
app.delete(chargePointsPath + hashKeyPath , function(req, res) {
  let params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  let deleteItemParams = {
    TableName: tableName,
    Key: params
  }
  /* TODO: (?) Add 404 etc */
  dynamodb.delete(deleteItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.statusCode = 202;
      res.json(
        {
          success: 'ChargePoint "'+req.params[partitionKeyName]+'" has been deleted.'
        }
      );
    }
  });
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

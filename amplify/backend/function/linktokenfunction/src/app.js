/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda();

let tableName = "userdb";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const plaid = require('plaid')
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
})

const userIdPresent = true; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/create-link-token";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
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

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (!data.Item) {
        req.body = {
          id: req.request.userAttributes.sub,
          email: req.request.userAttributes.email,
          username: '',
          items: [],
          transactions: []
        }
        if (userIdPresent) {
          req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
        }
        let putItemParams = {
          TableName: tableName,
          Item: req.body
        }
        dynamodb.put(putItemParams, (err, data) => {
          if(err) {
            res.statusCode = 500;
            res.json({error: err, url: req.url, body: req.body});
          } else{
            res.json({success: 'post call succeed!', url: req.url, data: data})
          }
        });
      }

      plaidClient.createLinkToken({
        user: {
          client_user_id: req.request.userAttributes.sub,
        },
        client_name: 'PiggyBank',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en'
        }, (err, linkTokenResponse) => {
          if(linkTokenResponse.link_token) {
            var params = {
              FunctionName: process.env.FUNCTION_ACCESSTOKENFUNCTION_NAME, 
              InvocationType: 'RequestResponse',
              LogType: 'Tail',
              Payload: '{"publicToken":"' + linkTokenResponse.link_token + '"}'
            };
          
            lambda.invoke(params, function(err, data) {
              if(err) {
                res.statusCode = 500;
                res.json({error: err, url: req.url, body: req.body});
              } else{
                res.json({success: 'accesstokenfunction lamda called!', url: req.url, data: data})
              }
            });
        }
      });
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
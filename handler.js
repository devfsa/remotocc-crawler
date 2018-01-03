'use strict';

module.exports.helloWorld = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.crawlerRemoteJobs = (event, context, callback) => {
  const AWS = require('aws-sdk');
  AWS.config.update({region: 'us-east-1'});

  const s3 = new AWS.S3();

  var params = {
    Body: "Test", 
    Bucket: "remote-cc", 
    Key: "jobs.json", 
    ServerSideEncryption: "AES256", 
    Tagging: "key1=value1&key2=value2"
   };

   s3.putObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
      ServerSideEncryption: "AES256", 
      VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
     }
     */
   });

  console.log('LogScheduledEvent');
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('S3 Object:', JSON.stringify(s3, null, 2));



  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'It works!'
    }),
  };

  callback(null, response);
}
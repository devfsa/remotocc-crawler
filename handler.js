'use strict';

module.exports.crawlerRemoteJobs = (event, context, callback) => {
  const AWS = require('aws-sdk');
  AWS.config.update({region: 'us-east-1'});
  
  const s3 = new AWS.S3();

  const stackoverflow = require('./stackoverflow-jobs');
  
  stackoverflow.run(function(error, results) {
    let output = [];
  
    results.forEach(function(result) {
      output = output.concat(result);
    });

    const textJson = JSON.stringify({ updated_at: new Date(), jobs: output });
    
    var params = {
      Body: textJson, 
      Bucket: "remote-cc", 
      Key: "jobs.json", 
      ACL: 'public-read',
      ServerSideEncryption: "AES256", 
      // Tagging: "key1=value1&key2=value2"
     };
  
     s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else     console.log(data);           // successful response
    });
    console.log('LogScheduledEvent');
  });

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

module.exports.parseJsonJobsToYmal = (event, context, callback) => {
  const S3PutObject = require('./lib/S3').putObject
      , YAML = require('yamljs')
  ;

  let yamlString = YAML.stringify({ hello: 'world' });
  
  S3PutObject(yamlString, 'jobs.yml', 'public-read', function(err, data) {
    if (err) console.log('error', err, err.stack); // an error occurred
    else     console.log('success', data);         // successful response
  });

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

  console.log('ParseJsonToYmal LogScheduledEvent');
}
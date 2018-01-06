'use strict';

module.exports.crawlerRemoteJobs = (event, context, callback) => {
  
  const S3PutObject = require('./lib/S3').putObject
      , stackoverflow = require('./stackoverflow-jobs')
      , YAML = require('yamljs')
  ;
  
  stackoverflow.run(function(error, results) {
    let output = [];
    
    results.forEach(function(result) {
      output = output.concat(result);
    });
    
    let yamlString = YAML.stringify({ updated_at: new Date(), jobs: output });

    S3PutObject(yamlString, 'jobs.yml', 'public-read', function(err, data) {
      if (err) console.log('error', err, err.stack); // an error occurred
      else     console.log('success', data);         // successful response
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
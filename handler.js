'use strict';

const jobsFile = process.env.JOBS_FILE || 'jobs.yml';

module.exports.crawlerRemoteJobs = (event, context, callback) => {
  
  const S3Lib = require('./lib/S3')
      , stackoverflow = require('./stackoverflow-jobs')
      , YAML = require('yamljs')
      , bucketName = process.env.BUCKET_NAME
      , region = process.env.REGION || process.env.AWS_REGION
  ;

  S3Lib.setConfig(bucketName, region);
  
  stackoverflow.run(function(error, results) {
    let output = [];
    
    results.forEach(function(result) {
      output = output.concat(result);
    });
    
    let yamlString = YAML.stringify(output, 4);

    S3Lib.putObject(yamlString, jobsFile, 'public-read', function(err, data) {
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
      message: 'crawlerRemoteJobs: It works!'
    }),
  };

  callback(null, response);
};

module.exports.sendJobsFileToRepository = (event, context, callback) => {

  const GitHubApi = require('github');
  const S3GetObject = require('./lib/S3').getObject;
  const async = require('async');
  const moment = require('moment');
  
  const user = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const filename = process.env.GITHUB_FILE;
  const token = process.env.GITHUB_TOKEN;
  const path = process.env.DATA_FILE;
  const commitMessage = 'Code commited from AWS Lambda at ' + moment().format();
  
  var code, referenceCommitSha, newTreeSha, newCommitSha;

  var github = new GitHubApi();

  // user token
  github.authenticate({
    type: 'token',
    token: token,
  });

  async.waterfall([

    // get the object from s3 which is the actual code
    // that needs to be pushed to github
    function(callback) {
      console.log('Getting Jobs from S3...');
      S3GetObject(filename, function(err, data) {
        if (err) console.log(err, err.stack);
        if (! err) {
          // code from s3 to commit to github
          code = data.Body.toString('utf8');
          callback(null);
        }
      });
    },

    // get a reference to the master branch of the repo
    function(callback){
      console.log('Getting reference...');
      github.gitdata.getReference({
        owner: user,
        repo: repo,
        ref: 'heads/master'
        }, function(err, data){
         if (err) console.log(err);
         if (!err) {
           referenceCommitSha = data.data.object.sha;
           callback(null);
         }
      });
    },

     // create a new tree with our code
     function(callback){
      console.log('Creating tree...');
      var files = [];
      files.push({
        path: path,
        mode: '100644',
        type: 'blob',
        content: code
      });

      github.gitdata.createTree({
        owner: user,
        repo: repo,
        tree: files,
        base_tree: referenceCommitSha
      }, function(err, data){
        if (err) console.log(err);
        if (!err) {
          newTreeSha = data.data.sha;
          callback(null);
        }
      });
    },

    // create the commit with our new code
    function(callback){
      console.log('Creating commit...');
      github.gitdata.createCommit({
        owner: user,
        repo: repo,
        message: commitMessage,
        tree: newTreeSha,
        parents: [referenceCommitSha]
      }, function(err, data) {
        if (err) console.log(err);
        if (!err) {
          newCommitSha = data.data.sha;
          callback(null);
        }
      });
    },

    // update the reference to point to the new commit
    function(callback){
      console.log('Updating reference...');
      github.gitdata.updateReference({
        owner: user,
        repo: repo,
        ref: 'heads/master',
        sha: newCommitSha,
        force: true
      }, function(err, data) {
        if (err) console.log(err);
        if (!err) callback(null, 'done');
      });
    }
  ], function (err, result) {
    if (err) context.done(err, "Drat!!");
    if (!err) context.done(null, "Code successfully pushed to github.");
  });

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'sendJobsFileToRepository: It works!'
    }),
  };

  console.log(context);

  callback(null, response);
};
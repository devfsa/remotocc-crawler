const stackoverflow = require('./stackoverflow-jobs');

stackoverflow.run(function(error, results) {
  let output = [];

  results.forEach(function(result) {
    output = output.concat(result);
  });

  console.log(JSON.stringify(output));
});
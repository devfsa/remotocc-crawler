const Crawler = require("crawler");

const c = new Crawler({
  maxConnections : 10,
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error) {
      console.log(error);
    } else {
      let $ = res.$;
      let jobs = [];
      let job = {};

      $('.-job-summary').each(function() {
        Object.assign(job, {});

        job = {
          title: $(this).find('.-title h2 a').text(),
          url: $(this).find('.-title h2 a').attr('href'),
          company: $(this).find('.-company .-name').text(),
          timestamp: new Date(),
          tags: []
        };

        $(this).find('.-tags a').each(function() {
          job.tags.push($(this).text());
        });

        jobs.push(job);
      });

      jobs.map(function(job) {
        console.log(job);
      });
    }

    done();
  }
});

// Queue just one URL, with default callbackk
c.queue('https://stackoverflow.com/jobs?l=Remote&sort=p');
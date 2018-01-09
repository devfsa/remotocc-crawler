const AWS = require('aws-sdk')
    , bucketName = 'remote-cc'
    , region = 'us-east-1'
;
  
AWS.config.update({ region: region });

module.exports = {
    putObject: function(body, filename, acl, callback, encryption) {
        const s3 = new AWS.S3();

        encryption = encryption || 'AES256';
        
        var params = {
            Body: body, 
            Bucket: bucketName, 
            Key: filename, 
            ACL: acl,
            ServerSideEncryption: encryption
        };
        
        return s3.putObject(params, callback);
    },

    getObject: function(filename, callback) {
        const s3 = new AWS.S3();
        
        var params = {
            Bucket: bucketName,
            Key: filename,
        }

        return s3.getObject(params, callback);
    }
    
};
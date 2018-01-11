const AWS = require('aws-sdk')
    , bucketName = undefined
    , region = undefined
;

module.exports = {
    bucketName: undefined,
    setConfig: function(bucketName, region) {        
        AWS.config.update({ region: region });
        this.bucketName = bucketName;
    },
    putObject: function(body, filename, acl, callback, encryption) {
        const s3 = new AWS.S3();

        encryption = encryption || 'AES256';
        
        var params = {
            Body: body, 
            Bucket: this.bucketName, 
            Key: filename, 
            ACL: acl,
            ServerSideEncryption: encryption
        };
        
        return s3.putObject(params, callback);
    },

    getObject: function(filename, callback) {
        const s3 = new AWS.S3();
        
        var params = {
            Bucket: this.bucketName,
            Key: filename,
        }

        return s3.getObject(params, callback);
    }
    
};
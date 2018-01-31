'use strict';

var AWS = require('aws-sdk'),
    uuid = require('uuid'),
    documentClient = new AWS.DynamoDB.DocumentClient();
var bcrypt = require('bcrypt-nodejs');
var config = require('config.json');

exports.handler = function (event, context, callback) {

    bcrypt.genSalt(config.saltFactor, function (err, salt) {
        if (err) return callback(err, null);
        bcrypt.hash(event.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            var params = {
                Item: {
                    "id": uuid.v1(),
                    "name": event.name,
                    "email": event.email,
                    "password": hash
                },
                TableName: process.env.TABLE_NAME
            };
            documentClient.put(params, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(err, data);
                }
            });
        });
    });
}
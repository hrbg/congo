var mongoose = require('mongoose');
var mongodb = require('./mongodb');

mongoose.connect(mongodb.url);
console.log('** Connected to => ' + mongodb.url);

module.exports.mongoose = mongoose;

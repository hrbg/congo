var mongoose = require('../config/mongo_connection').mongoose;
var Schema   = mongoose.Schema;

var Pastes = new Schema({
  body: { type: String },
  preview : { type: String, set: preview },
  code: { type: String, default: generateCode, index: { unique : true } },
  created_at: { type: Date, default: Date.now }
});

//Fixme: This also allows space only pasties 
Pastes.path('body').validate(function (v) {
  return v.length > 0;
}, "Can't be blank");

function preview(code) {
  return code.substring(0, 100);
}

function generateCode() {
  return Math.floor(Math.random() * 1000000);
}

mongoose.model('Paste', Pastes);

var Paste = mongoose.model('Paste');

Paste.findLastFive = Paste.find({}).sort('created_at', 'descending').limit(5);

module.exports.Paste = Paste;

var mongoose = require('../config/mongo_connection').mongoose;
var Schema   = mongoose.Schema;

var Pastes = new Schema({
  body: {type: String},
  code: { type: String, default: Date.now, index: true },
  created_at: { type: Date, default: Date.now}
});

//Fixme: This also allows space only pasties 
Pastes.path('body').validate(function (v) {
  return v.length > 0;
}, "Can't be blank");

mongoose.model('Paste', Pastes);

var Paste = mongoose.model('Paste');

module.exports.Paste = Paste;
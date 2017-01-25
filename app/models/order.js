var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = mongoose.model('Order',new Schema({
	userid: String,
	videoid: String,
	videotitle : String,
	dateoforder: Date,
	dateofreturn : Date,
	orderstatus: String
}));
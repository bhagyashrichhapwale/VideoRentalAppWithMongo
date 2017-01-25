var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = mongoose.model('User',new Schema({
	name: String,
	password: String,
	firstname: String,
	lastname: String,
	emailid: String,
	address1: String,
	address2: String,
	city: String,
	state: String,
	zipcode: String,
	admin: Boolean
}));
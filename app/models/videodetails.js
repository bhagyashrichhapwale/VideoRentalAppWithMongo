var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = mongoose.model('Video',new Schema({
	title: String,
	description: String,
	rating: Number,
	cast: String,
	genre: Number,
	releasedate: Date,
	imgpath: String
	
}));
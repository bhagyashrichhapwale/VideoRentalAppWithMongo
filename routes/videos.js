var express = require('express');
var router = express.Router();

var monk = require('monk');



var db = monk('mongodb://bkc1:mlab123@ds117919.mlab.com:17919/bkcvideorental');





var jwt = require('jsonwebtoken');
var Video = require('../app/models/videodetails.js');


/*
router.use(function(req,res,next){

	//Check header or url parameters or post parameters for token
	

	console.log("Inide checking the token"+req.token);
	var token = req.body.token || req.headers['x-access-token'] || req.token;

	//decode token
	if(token)
	{
		console.log('Inside token found')

		//verifies secret and checks expiry
		jwt.verify(token,'iloveabudi',function(err,decoded){

			if(err)
			{
				return res.json({success:false,message:'Failed to authenticate the token'});
			}
			else
			{
				//if everything is good save to the request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else
	{
		console.log('inside token not found');
		//if there is no token return error
		return res.json({
			success:false,
			message:'No token provided'
		});
	}

});*/

router.get('/',function (req,res) {
	
	console.log("Inside the get service");
	console.log(req.query.genre);
	var collection = db.get('videos');


	var todayDate = new Date();
	var previousDate = new Date();
	previousDate.setMonth(previousDate.getMonth()-6);

	var prevJsonDate = JSON.stringify(previousDate);

	var todayJsonDate = JSON.stringify(todayDate);

	

	if(req.query.genre != "" && req.query.genre !=0 && req.query.genre != undefined	)
	{
		console.log("Inside the genre option "+ req.query.genre);
		
		collection.find({ genre: parseInt(req.query.genre)},function(err,videos){
			if(err) throw err;

			console.log(videos);
			res.json(videos);
			});	
	}

	if(req.query.option == "toprated")
	{
		console.log("In "+req.query.option);
		collection.find({rating: {$gt : 4}},function(err,videos){
		if(err) throw err;

		//console.log(videos);
		res.json(videos);
		});		
	}
	else if(req.query.option == "newreleases")
	{
			collection.find({releasedate: {$gte : previousDate.toISOString() , $lte : todayDate.toISOString() }},function(err,videos){
			if(err) throw err;

			//console.log(videos);
			res.json(videos);
			});		
	}
	else
	{

		console.log("In the else part");
		collection.find({},function(err,videos){
		if(err) throw err;

		//console.log(videos);
		res.json(videos);
	});	
	}

});

router.post('/',function(req,res)
{
	console.log("Inide post "+req.body.releasedate);

	var newVideo = new Video({
		title:req.body.title,
		description: req.body.description,
		rating: req.body.rating,
		cast: req.body.cast,
		genre: req.body.genre,
		releasedate: req.body.releasedate,
		imgpath: req.body.imgpath

	});


	newVideo.save(function(err){
		if(err) throw err;

		console.log("Video Saved successfully"+newVideo);
		res.json(newVideo);
	});


	/*
	var collection = db.get('videos');

	collection.insert({
		title:req.body.title,
		description:req.body.description	
	},
	function(err,video)
	{
		if(err) throw err;
		res.json(video);
	});
	*/
	
});


router.get('/:id',function(req,res){

	console.log("Inside get with id "+ req.query.genre);

	var collection = db.get('videos');

	console.log("Else part for get wid id");
	collection.findOne({_id:req.params.id},function(err,video)
	{
		if(err) throw err;
		//console.log(video);
		res.json(video);
	});		
});


router.put('/:id',function(req,res){

	var collection = db.get('videos');

	collection.update(
	{
		_id:req.params.id
	},
	{
		title:req.body.title,
		description:req.body.description
	},
	function(err,video)
	{
		if(err) throw err;
		res.json(video);
	});
});

router.delete('/:id',function(req,res)
{
	var collection = db.get('videos');

	collection.remove({_id:req.params.id},function(err,video)
	{
		if(err) throw err;
		res.json(video);	
	})
});

module.exports = router;


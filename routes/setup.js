var express = require('express');
var router = express.Router();
var User = require('../app/models/user.js');
var monk = require('monk');
var jwt = require('jsonwebtoken');

var db = monk('mongodb://bkc1:mlab123@ds117919.mlab.com:17919/bkcvideorental');
//var db = monk('mongodb://bhagyashrichhapwale:mlab@123@ds01316.mlab.com:1316/bkcvideorental');


console.log("Insdide user set up file");
router.post('/',function(req,res){
	console.log('Inside the setup');

	//res.json({sucess:true});

	var newUser = new User({
		name: req.body.name,
		password:req.body.password,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		emailid:req.body.emailid,
		address1:req.body.address1,
		address2:req.body.address2,
		city:req.body.city,
		state:req.body.state,
		zipcode:req.body.zipcode,
		admin:false
	});



	newUser.save(function(err){
		if(err) throw err;

		console.log("User saved successfully");
		res.json({sucess:true});
	});

});


router.post('/authenticate',function(req,res,next)
{
	console.log("Inside authenticate");
	console.log(req.body.name);

	var User = db.get('users');
/*
	User.find({},function(err,users)
	{
		if(err) throw err;
		
		res.json(users);
	});
*/
	User.findOne({
		name:req.body.name
	},function(err,user){
		if(err) throw err;

		if(!user)
		{
			res.json({success:false,message:"User not found"});
		}
		else
		{
			if(user)
			{
				//Check if password matches
				if(user.password != req.body.password)
				{
					res.json({sucess:false,message:"Incorrect password"});
				}
				else
				{
					console.log("The user entered is correct");

					var token = jwt.sign(user,'iloveabudi',
					{	expiresIn:60*60*24
					});

					console.log("Got the token now sending the response");

					console.log(user);
					console.log(user._id);

					res.json({
						success:true,
						message:"Token fetched successfully!",
						token:token,
						admin:user.admin,
						userid:user._id

					});

					req.token = token;

				}
			}
		}
	

	})	
});

/*router.post('/logout',function(req,res){

	console.log("Inside logout "+req.body.token);
	var token = req.body.token;

	jwt.verify(token,'iloveabudi',function(err,decoded){

			if(err)
			{
				return res.json({success:false,message:'Failed to authenticate the token'});
			}
			else
			{
				//if everything is good save to the request for use in other routes
				db.get(decoded.auth,function(err,record){
					var updated = JSON.parse(record);

					updated.valid = false;

					db.put(decoded.auth,updated,function(err){

        			res.writeHead(200, {'content-type': 'text/plain'});
        			console.log("Logging off");
        			return res.json({success:true,message:'Logged Out'});
					});
				});



			}
		});

});*/




module.exports = router;


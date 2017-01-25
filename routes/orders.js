var express = require('express');
var router = express.Router();
var Order = require('../app/models/order.js');
var monk = require('monk');
var jwt = require('jsonwebtoken');




var db = monk('mongodb://bkc1:mlab123@ds117919.mlab.com:17919/bkcvideorental');
//var db = monk('mongodb://bhagyashrichhapwale:mlab@123@ds01316.mlab.com:1316/bkcvideorental');

router.use(function(req,res,next){

	//Check header or url parameters or post parameters for token
	

	console.log("Inide checking the token"+req.query.token);
	var token = req.body.token || req.query.token ||req.headers['x-access-token'] || req.token;

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

});


console.log("Insdide order file");

router.get('/',function(req,res)
{
	console.log("Inside order det "+req.query.userid);

	var collection = db.get('orders');

	var count = 0;


	collection.find({userid:req.query.userid},function(err,data)
	{
		if(err) throw err;
		console.log(data);
		res.json(data);
	});


})


router.get('/:id',function(req,res){
	
	var collection = db.get('orders');

	collection.findOne({_id:req.params.id},function(err,order){
		res.json(order);
	});
});

router.delete('/:id',function(req,res)
{
	console.log("Inside order delete "+req.params.id);
	var collection = db.get('orders');

	collection.remove({_id:req.params.id},function(err,order)
	{
		if(err) throw err;
		res.json(order);	
	})
});




router.post('/',function(req,res)
{
	console.log('Inside the order post userid is '+req.body.userid);


	var collection = db.get('orders');

	
	var count = 0;

	collection.count({userid : req.body.userid,orderstatus:"IP"},function(err,data){

		if(data <5)
		{

			var todaysDate = new Date();

			var dateofret = new Date();
			dateofret.setDate(todaysDate.getDate()+10);


			var order = new Order({
			userid:req.body.userid,
			videoid:req.body.videoid,
			dateoforder:req.body.dateoforder,
			dateofreturn: dateofret,
			videotitle: req.body.videotitle,
			orderstatus:req.body.orderstatus
			});

			console.log('Inside the order post');


			order.save(function(err,order){
				console.log("Inside save func");
				if(err) throw err;

				console.log("Order saved successfully");
				res.json({success:true,order:order});
			});
		}
		else
		{
			res.json({success:false,message:'Your order was not saved as you already have 5 open orders.'});
		}


		
	});


	//if(count >=5)
	//		return res.json({sucess:false,message:'Your order cannot saved as you have 5 orders in your queue.'})
	
	
	console.log("After orders query");

	//res.json({sucess:true});

	/*var order = new Order({
		userid:req.body.userid,
		videoid:req.body.videoid,
		dateoforder:req.body.dateoforder,
		lastname:req.body.lastname,
		orderstatus:req.body.orderstatus
	});

	console.log('Inside the order post');


	order.save(function(err,order){
		console.log("Inside save func");
		if(err) throw err;

		console.log("Order saved successfully");
		res.json({sucess:true,order:order});
	});*/

});

module.exports = router;

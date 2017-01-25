var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var monk = require('monk');

var db = monk('mongodb://bkc1:mlab123@ds117919.mlab.com:17919/bkcvideorental');

router.post('/',function(req,res)
{
	console.log("Inside the mail sender");

	console.log("User id "+req.body.userid);


	var collection = db.get('users');
	var name = "";
	var emailid = "";


	


	
	console.log("Email id beofre sending "+emailid);

	collection.findOne({_id:req.body.userid},function(err,user){
		if(err) throw err;
		
		name = user.name;
		emailid = user.emailid;

		var transporter = nodemailer.createTransport({
		host: 'domain',
    	port: 587,
    	secure: false, // use SSL
    	debug: true,
		service : 'Gmail',
		auth: {
			user : 'bkcdvdrentals@gmail.com',
			pass : 'bkcrental123'
		}
		});

		var todaysDate = new Date();

		var dateofret = new Date();

		dateofret.setDate(todaysDate.getDate()+10);


		var text = 'Welcome ' + name +
		'\n\nWe have received your order , your order id is '+req.body.orderid + 
		' .You will receive the DVD within two working days on your mailing address , you can track the same on our website.' +  
		'\n\nThe date of return is '+dateofret + '.Please note if you fail to return on time you may be charged extra as per the conditions.'
		+ '\n\nThank you once again for giving us an opportunity to serve you.' +'\nBetflix Team.';



		transporter.sendMail(
 		{
			  from: 'bhagyashrichhapwale@gmail.com',
		      to: emailid,
		      subject: 'Betflix Dvd Order Details',
		      text: text,
		      //html: '<p>I Love You So Muchhhh....</p>'
		}
		, function(error, info){
		    if(error){
		        console.log(error);
		        res.json({message: 'error'});
		    }else{
		        console.log('Message sent: ' + info.response);
		        res.json({message: info.response});
		    }
		});
	});

});


module.exports = router;

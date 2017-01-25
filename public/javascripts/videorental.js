var app = angular.module('videorental',['ui.router','ngResource','ngAnimate', 'ui.bootstrap','ngCookies']);
var token = "";


app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise('/home');


	$stateProvider.
		state('home',{
			url:'/home',
			views: {
				'main@':{
					templateUrl:'/partials/home.html'
					
				}
			}
		})
		.state('mainmenu',
		{
			parent:'home',
			url:'/mainmenu',
			views:
			{
				'main@':{
				 templateUrl:'partials/sidebarhome.html',
				 controller:'videoListCtrl'
					

				}
			}
		}
		)
		.state('videolist',{
			parent:'home',
			url:'/videolist',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'videoListCtrl'
					
				}
			}
		}
		)
		.state('newreleases',{
			parent:'home',
			url:'/release',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'newReleaseCtrl'
					
				}
			}
		}
		)
		.state('toprated',{
			parent:'home',
			url:'/toprated',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'topRatedCtrl'
					
				}
			}
		}
		)
		.state('genreList',{
			parent:'home',
			url:'/genrelist/:genre',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'genreListCtrl'
				}
			}
		})
		.state('videodet',{
			parent:'videolist',
			url:'/videodet/:id',
			views:
			{
				'main@':{
					templateUrl:'partials/videodet.html',
					controller:'videoDetCtrl'
				}
			}
		})
		.state('addvideo',{
			
			url:'/addvideo',
			views:
			{
				'main@':{
				 templateUrl: '/partials/addvideo.html',
				 controller:'addvideoCtrl'
				}
			}
		})
		.state('moddelvideo',
		{
			parent:'home',
			url:'/moddelvideo/:id',
			views:
			{
				'main@':{
					templateUrl:'partials/moddelvideo.html',
					controller:'moddelvideoCtrl'
				}
			}
		})
		.state('signup',
		{
			url:'/signup',
			views:
			{
				'main@':{
					templateUrl:'partials/signup.html',
					controller:'registerlogin'

				}
			}
		})
		.state('signin',
		{
			url:'/signin',
			views:
			{
				'main@':{
					templateUrl:'partials/signin.html',
						controller:'registerlogin'

				}
			}
		})
		.state('logout',
		{
			url:'/logout',
			views:
			{
				'main@':{
						templateUrl:'partials/logout.html',
						controller:'registerlogin'

				}
			}
		})
		.state('orderdetails',
		{
			url:'/orderdetails',
			views:
			{
				'main@':{
					templateUrl:'partials/orderdetails.html',
					controller: 'orderDetCtrl'
						

				}
			}
		})



}]);


app.controller('orderDetCtrl',['$scope','$resource','$stateParams','$location','$cookieStore','$window',orderDetCtrl]);

function orderDetCtrl($scope,$resource,$stateParams,$location,$cookieStore,$window)
{
	var orders = $resource('/orders')	;
	var userid = $cookieStore.get('userid');
	var token = $cookieStore.get('token');
	$scope.sortType = "dateoforder";
	$scope.sortReverse  = false;
	$scope.searchstatus = "orderstatus";
	//$scope.ordernotfound = true;

	orders.query({userid:userid,token:token},
		function(data)
		{
			//var wrapped = angular.fromJson(data); 
			angular.forEach(data, function(value, key){
				

				if(value.orderstatus == "IP")
					value.orderstatus = "Open";
				if(value.orderstatus == "CO")
					value.orderstatus = "Closed";
				if(value.orderstatus == "CN")
					value.orderstatus = "Canceled";
				
				
			});
			$scope.orders = data

			if(data.length == 0)
			{
				$scope.orderfound = false;
				$scope.ordernotfound = true;
			}
			else
			{
				$scope.orderfound = true;
				$scoep.ordernotfound = false;
			}
    	
    	});

	$scope.cancelOrder = function(orderid,orderstatus)
	{

		
		if(orderstatus != "Closed" && orderstatus != "Cancelled")
		{
			var order = $resource('/orders/:id');

			order.delete({id:orderid,token:$cookieStore.get('token')},function(data){
				$scope.message = "Order is cancelled successfully";
				$scope.header = "Success"
	
			});
		}
		else
		{
			$scope.header = "Error"
			$scope.message = "Order cannot be cancelled as the order status is not Open.";
		}

		/*var deleteUser = $window.confirm('Are you sure you want to delete the order?');


		if(deleteUser){
		alert("Order id is"+orderid);

		var order = $resource('/orders/:id');

		order.delete({id:orderid,token:$cookieStore.get('token')},function(data){
				alert("Your order is deleted successfully");
			
			
		});
		}*/	
	}

}


app.controller('videoDetCtrl',['$scope','$resource','$stateParams','$location','$cookieStore',videoDetCtrl]);

function videoDetCtrl($scope,$resource,$stateParams,$location,$cookieStore)
{

	var Videos = $resource('/api/videos/:id');

	
	var token =  $cookieStore.get('token');
	
	var title = "";

	Videos.get({id:$stateParams.id},function(video){
	
		$scope.video = video;
		title = video.title;
	

	var Order = $resource('/orders');

	
	var order = {
		userid: $cookieStore.get('userid'),
		videoid: $stateParams.id,
		videotitle: title,
		dateoforder: new Date(),
		orderstatus : "IP"
	};

	$scope.rent = function()
	{

		if($cookieStore.get('token') == undefined || $cookieStore.get('userid') == undefined || $cookieStore.get('token') == "" || $cookieStore.get('userid') == "")
		{
			$scope.error = "To rent a dvd please sign up if you are a new customer else sign in";
			return false;
		}

		Order.save({token:token},order,function(data)
		{
			
			if(data.success == false)
			{
				alert("Inside success is false");

				if(!data.message || data.message.length !=0)
				{
					alert("Inside message is not null");
					$scope.error = data.message;
					return false;
				}
				else
				{
					$scope.error = "Your order was not saved.Please try again";
					return false;
				}
			}
			else
			{
				var mailSender = $resource('/mailsender');

				var mailData = {
					userid: $cookieStore.get('userid'),
					videoid: $stateParams.id,
					dateoforder: new Date(),
					orderid : data.order._id
				};

				mailSender.save(mailData,function(data)
				{
					
				});


				$scope.success = true;
			}

			
		});
	}

	});
}




app.controller('videoListCtrl',['$scope','$resource','$cookieStore',videoListCtrl]);

function videoListCtrl($scope,$resource,$cookieStore)
{
	
	var videos = $resource('/api/videos');
	$scope.temp = "bhagi";

	videos.query({token:token},function(videos){
		$scope.videos = videos;
	});
}

//New releases

app.controller('newReleaseCtrl',['$scope','$resource','$cookieStore',newReleaseCtrl]);

function newReleaseCtrl($scope,$resource,$cookieStore)
{
	
	var videos = $resource('/api/videos');
	
	videos.query({option:"newreleases"},function(videos){
		$scope.videos = videos;
	});
}

//Top Rated

app.controller('topRatedCtrl',['$scope','$resource','$cookieStore',topRatedCtrl]);

function topRatedCtrl($scope,$resource,$cookieStore)
{
	
	var videos = $resource('/api/videos');
	
	videos.query({option:"toprated"},function(videos){
		$scope.videos = videos;
	});
}


app.controller('genreListCtrl',['$scope','$resource','$stateParams','$location','$cookieStore',genreListCtrl]);

function genreListCtrl($scope,$resource,$stateParams,$location,$cookieStore)
{
	var Videos = $resource('/api/videos');

	Videos.query({genre:$stateParams.genre},function(videos){
		$scope.videos = videos;
	});
}




app.controller('addvideoCtrl',['$scope','$resource','$location',addvideoCtrl]);

function addvideoCtrl($scope,$resource,$location)
{
	var Videos = $resource('/api/videos');

	$scope.save = function()
	{
		Videos.save({token:token},$scope.video , function(video){
			$location.path('/home');
		});
	};

}	

app.controller('moddelvideoCtrl',['$scope','$resource','$location','$stateParams',moddelvideoCtrl]);

function moddelvideoCtrl($scope,$resource,$location,$stateParams)
{
	var Videos = $resource('/api/videos/:id',{id:'@_id'},
	{
		update : {method:'PUT'}
	}
	);

	Videos.get({id:$stateParams.id},function(video){
		//alert("Inside get"+video.title);
		$scope.video = video;
	});


	$scope.save = function()
	{
		Videos.update($scope.video,function()
		{
			$location.path('/home');
		});
	}

	$scope.delete = function()
	{
		Videos.delete({id:$stateParams.id},function(video)
		{
			$location.path('/home');
		})
	}

}

app.controller('registerlogin',['$scope','$resource','$location','$cookieStore',registerlogin]);

function registerlogin($scope,$resource,$location,$cookieStore)
{
	$scope.loginSuccess = false;

	$scope.save = function(isValid)
	{
		$scope.submitted = true;

		if(isValid)
		{


		var User = $resource('/setup');

		//alert($scope.user.name);

		User.save($scope.user,function(user)
		{
			$scope.user = user;
			
		});

			if($scope.login(true)){
				$scope.loginSuccess = true;
				$scope.succMsg = "Sign up successful , Please proceed..";
				$scope.submitted = false;
				return true;
					
			}
		}
		else
		{
			return false;
		}

	}

	$scope.login = function(isValid)
	{
		var loginUser = $resource('/setup/authenticate');

		$scope.submitted = true;

		if(isValid)
		{

			loginUser.save($scope.user,function(data){
				
				if(data.success == true)
				{
					$scope.success = true;
					$scope.message = "Login successful , Please proceed..";
				}
				else
				{
					$scope.error = true;
					$scope.message = "Login failed , Please again..";
				}

				token = data.token;
				admin = data.admin;
				userid = data._id;

				 token = data.token;
				var admin = data.admin;
				

				$cookieStore.put('token',data.token);
				$cookieStore.put('userid',data.userid);

			});

			return isValid;
		}
		else
		{
			return false;
		}
				
	}

	$scope.logout = function()
	{
		alert("Inside logout "+$cookieStore.get('token'));
		var logout = $resource('/setup/logout');

		logout.save({token:$cookieStore.get('token')},function(data)
		{
			alert("Logout successful "+JSON.stringify(data));
		});
	}
}


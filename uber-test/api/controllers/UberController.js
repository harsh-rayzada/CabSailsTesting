/**
 * UberController
 *
 * @description :: Server-side logic for managing Ubers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	loginPickup: function(req, res){
	    if(req.param('code')){
	      	var code = req.param('code');
	      	PickupService.pickupLogin(code, function(err, body){
	      		err = JSON.parse(err);
	      		body = JSON.parse(body);
	        	if(err){
	          		res.status(500).json(err);
	        	}else if(body.error){
	        		res.status(500).json(body);
	        	}else{
	          		sails.log.debug('login successful');
	          		res.view('home',{accessToken: body.access_token, refreshToken: body.refresh_token});
	        	}
	      	});
	    }else{
	      	res.json(req.param.all());
	    }
	},

	options: function(req, res){
		// initia name, num, reciever name, num, initia uber token, refresh token , pickup lat long, drop lat long, smartphone flag, familyMember flag, product id
		// if smartphone is no
		// 	then pick up and drop latlong is compulsory
		// else smartphone
		// 	if app
		// 		check database for lat known loc and check how old
		// 		if not older than x mins then pull up from db and show accept/reject
		// 		else is same as no app
		// 	else
		// 		browsr asks for loc and provide options - accept reject

		if(!req.body || !req.body.userName || !req.body.userNum || !req.body.recieverName || !req.body.recieverNum || !req.body.userToken || !req.body.refreshToken || !req.body.smartFlag || !req.body.appFlag || !req.body.productId){
			res.badRequest('Required parameters missing!');
		}else{
			if(req.body.smartFlag == 'false'){
				if(!req.body.pickupLatitude || !req.body.pickupLongitude || !req.body.destLatitude || !req.body.destLongitude){
					res.badRequest('Pickup and Destination coordinates must be present if reciever doesnt have a smartphone');
				}else{
					//Do everything, generate track link
					var rideData = {
						product_id: req.body.productId,
						start_latitude: req.body.pickupLatitude,
						start_longitude: req.body.pickupLongitude,
						end_latitude: req.body.destLatitude,
						end_longitude: req.body.destLongitude
					};

					PickupService.requestRide(rideData, req.body.userToken, function(error, response){
						if(error){
							res.status(500).json(error);
						}else if(response.error){
							res.status(500).json(response);
						}else{
							response.userToken = req.body.userToken;
							res.view('searching', {rideDetails: response});
						}
					});
					//create a web view with re requests in the backgroud to check driver acceptance
				}
			}
		}
	}
};
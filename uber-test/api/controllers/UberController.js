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

	getProducts: function(req, res){
		var locationData = {
			lat: req.param('latitude'),
			long: req.param('longitude')
		};
		PickupService.getTimeBasedCabs(locationData, req.param('userToken'), function(err, productsEstimate){
			err = JSON.parse(err);
			productsEstimate = JSON.parse(productsEstimate);
			if(err){
				res.status(500).json(err);
			}else if(productsEstimate.error){
				res.status(500).json(productsEstimate);
			}else{
				productsEstimate.lat = locationData.lat;
				productsEstimate.long = locationData.long;
				productsEstimate.token = req.param('userToken');
				res.view('product_list', {products: productsEstimate});
			}
		});
	},

	options: function(req, res){
		// initia name, num, reciever name, num, initia uber token, refresh token , pickup lat long, drop lat long, smartphone flag, familyMember flag, product id
		// if smartphone is no
		// 	then pick up and drop latlong is compulsory
		// else smartphone
		// 	if app
		// 		check database for lat long loc and check how old
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
			}else if(req.body.smartFlag == 'true'){
				if(req.body.appFlag == 'true'){
					if(!req.body.memberUserId){
						res.badRequest('family member id must be provided');
					}else{
						User.getFamilyMemberLocation(req.body.memberUserId, function(err, locationData){
							if(err){
								res.serverError(err);
							}else{
								var currentTime = Date.parse(new Date());
								var lastSeen = Date.parse(locationData.createdAt);
								if(currentTime - lastSeen <= 600000){
									//To be decided
								}
								// Location.findOne({where: {user: user_id}, sort: 'createdAt desc'}).exec(function(err, userLocationData){
								// 	if(err){
								// 		callback(err, null);
								// 	}else{
								// 		callback(null, userLocationData);
								// 	}
								// });
							}
						});
					}
				}else if(req.body.appFlag == 'false'){
					var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
				  	var shortlink = '';
				  	for (var i = 0; i < 15; i++) {
				    	var p = Math.floor(Math.random() * set.length);
				    	shortlink += set[p];
				  	}

				  	var linkData = {
				  		link: shortlink,
				  		token: req.body.userToken,
				  		name: req.body.userName,
				  		destination: req.body.destination,
				  		destLat: req.body.destLatitude,
				  		destLong: req.body.destLongitude,
				  		linkExpiry: 900000,
				  		productId: req.body.productId
				  	};
				  	Links.createPickupLink(linkData, function(err, linkCreationResponse){
				  		if(err){
				  			res.serverError(err);
				  		}else{
				  			var msg1 = req.body.userName+" would like to book a cab for you. Click on the link to continue: "+baseUrl+shortlink;
				  			var msg2 = "You have requested to book the cab for "+req.body.recieverName+". Here is the link: "+baseUrl+shortlink;
				  			link: linkCreationResponse.shortlink
				  	// 		SMSService.send({to:req.body.recieverNum, message: msg1}, function(err, msgResponse){
							// 	if(err)
							// 		res.serverError(err);
							// });
							// SMSService.send({to:req.body.userNum, message: msg2}, function(err, msgResponse){
							// 	if(err)
							// 		res.serverError(err);
							// });
				  		}
				  	});
				}
			}
		}
	},

	getDetails: function(req, res){
		Links.getLinkDetails(req.param('id'), function(err, initiatorData){
			if(err){
				res.serverError(err);
			}else{
				if(typeof initiatorData == 'string'){
					res.send(initiatorData);
				}else{
					res.view('startRide', {user:initiatorData});
				}
				//initiatorData should have username, destination location, link expiry time, user token
				// PickupService.getCabsTimeEstimate(initiatorData.token, function(err, response){
				// 	if(err){
				// 		res.status(500).json(err);
				// 	}else if(response.error){
				// 		res.status(500).json(response);
				// 	}else{
				// 		res.view('startRide', {availabilityData: response, user:initiatorData});
				// 	}
				// });
			}
		});
	},

	requestPickup: function(req, res){
		var rideData = {
			product_id: req.body.productId,
			start_latitude: req.body.pickupLatitude,
			start_longitude: req.body.pickupLongitude,
			end_latitude: req.body.destLatitude,
			end_longitude: req.body.destLongitude
		};
		PickupService.requestRide(rideData, req.body.userToken, function(err, response){
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				if(req.body.from == 'ajax'){
					res.send(response);
				}
				//else{
				// 	res.view('searching_ride',{ride_data: response});
				// }
			}
		});
	},

	checkStatus: function(req, res){
		PickupService.cabStatus(req.body.rideId, req.body.token, function(err, response){
			response = JSON.parse(response);
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				res.send(response);
			}
		});
	},

	getRideTrackLink: function(req, res){
		PickupService.getRideLink(req.body.rideId, req.body.token, function(err, response){
			response = JSON.parse(response);
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				var recieverMsg = "Your ride is arriving to your location. Click on the link to follow. "+response.href;
				var initiatorMsg = "Your booked ride for "+req.body.initiatorNum+" is arriving at their location. Click this link to follow. "+response.href;
				// SMSService.rideNotification({to: req.body.recieverNum, message: recieverMsg}, function(err, msgResponse){
				// 	if(err)
				// 		res.serverError(err);
				// });
				// SMSService.rideNotification({to: req.body.initiatorNum, message: initiatorMsg},function(err, msgResponse){
				// 	if(err)
				// 		res.serverError(err);
				// });
				res.json({success:true});
				// res.send(response);
			}
		});
	},

	getNearestPickup: function(req, res){
		var userPosition = {
			lat: req.body.position.lat,
			long: req.body.position.lng
		};

		PickupService.getTimeBasedCabs(userPosition, req.body.userToken, function(err, response){
			err = JSON.parse(err);
			response = JSON.parse(response);
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				// sails.log.debug(response);
				var estimateData = _.where(response.times,{product_id:req.body.product_id}); 
				res.send(estimateData);
			}
		});
	}
};
/**
 * UberController
 *
 * @description :: Server-side logic for managing Ubers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 //Change error codes appropriately (like 422 when invalid request is sent)
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
	          		var loginData = {
	          			accessToken: body.access_token,
	          			refreshToken: body.refresh_token,
	          			// clientId: body.client_id,
	          			// clientSecret: body.client_secret
	          		};
	          		res.view('home',{loginData: loginData});
	        	}
	      	});
	    }else{
	      	res.json(req.param.all());
	    }
	},

	//get nearest products to pickup lat long if no product id,
	//if product id then send nearest product id
	getProducts: function(req, res){
		var that = this;
		// PickupService.getTokenValidity(req.body.token, function(err, tokenResp){
		// 	err = JSON.parse(err);
		// 	tokenResp = JSON.parse(tokenResp);
		// 	if(err){
		// 		res.negotiate(err);
		// 	}else if(tokenResp.error){
		// 		res.negotiate(err);
		// 	}else{
				if(req.body.destination){
					console.log('1');
					var locationData = {
						pickupLat: req.param('pickupLat'),
						pickuplong: req.param('pickupLng'),
						destlat: req.param('destinationLat'),
						destlong: req.param('destinationLng')
					};
					PickupService.getPriceEstimates(locationData, req.param('token'), function(err, priceEstimates){
						err = JSON.parse(err);
						priceEstimates = JSON.parse(priceEstimates);
						if(err){
							sails.log.debug('err in getting price estimates');
							res.negotiate(err);
							// err.
						}else if(priceEstimates.error){
							sails.log.debug('err in getting price estimates');
							res.status(500).json(priceEstimates);
						}else{
							sails.log.debug('got price estimates');
							req.priceEstimates = priceEstimates;
							req.body.pickup.lat = locationData.pickupLat;
							req.body.pickup.lng = locationData.pickupLng;
							req.body.token = req.param('token');
							req.body.product_id = req.param('product_id');
							that.pickupTimeEstimates(req, res);
						}
					});
				}else if(req.body.pickup){
					console.log('2');
					that.pickupTimeEstimates(req, res);
				}else{
					console.log('3');
					res.status(200).json({valid: true});
				}
		// 	}
		// });
	},

	pickupTimeEstimates: function(req, res){
		sails.log.debug('entered pickup time estimates');
		var pickupLocationData = {
			lat: req.body.pickup.lat,
			long: req.body.pickup.lng
		};
		PickupService.getTimeEstimates(pickupLocationData, req.body.userToken, function(err, timeEstimates){
			err = JSON.parse(err);
			timeEstimates = JSON.parse(timeEstimates);
			if(err){
				sails.log.debug('err in getting time estimates');
				res.status(500).json(err);
			}else if(timeEstimates.error){
				sails.log.debug('err in getting time estimates');
				res.status(500).json(timeEstimates);
			}else{
				sails.log.debug('got time estimates');
				if(req.priceEstimates){
					console.log('4');
					timeEstimates.times.sort(function(a,b){return (a.display_name>b.display_name)});
					req.priceEstimates.prices.sort(function(a,b){return (a.display_name>b.display_name)});
					_.each(timeEstimates.times, function(timeEstimate, index){
						timeEstimate.surge_multiplier = req.priceEstimates.prices[index].surge_multiplier;
					});
				}
				if(req.body.product_id){
					console.log('req body', req.body);
					console.log('5');
					console.log('timeEstimates',timeEstimates);
					var estimateData = _.where(timeEstimates.times,{product_id:req.body.product_id}); 
					console.log('estimateData',estimateData);
					res.send(estimateData);
				}else{
					console.log('6');
					// timeEstimates.pickupLat = pickupLocationData.lat;
					// timeEstimates.long = pickupLocationData.long;
					// timeEstimates.token = req.param('userToken');
					// res.send(timeEstimates);
					res.view('product_list', {products: timeEstimates});
				}
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

		// if(!req.param('userName') || !req.param('userNum') || !req.param('recieverName') || !req.param('.recieverNum') || !req.param('userToken') || !req.param('refreshToken') || !req.param('smartFlag') || !req.param('appFlag') || !req.param('productId')){
		// 	res.badRequest('Required parameters missing!');
		// }else{
			// if(req.param('smartFlag') == 'false'){
				// if(!req.param('pickupLatitude') || !req.param('pickupLongitude') || !req.param('destLatitude') || !req.param('destLongitude')){
				// 	res.badRequest('Pickup and Destination coordinates must be present if reciever doesnt have a smartphone');
				// }else{
				// 	//Do everything, generate track link
				// 	var rideData = {
				// 		product_id: req.param('productId'),
				// 		start_latitude: req.param('pickupLatitude'),
				// 		start_longitude: req.param('pickupLongitude'),
				// 		end_latitude: req.param('destLatitude'),
				// 		end_longitude: req.param('destLongitude')
				// 	};

				// 	PickupService.requestRide(rideData, req.param('userToken'), function(error, response){
				// 		error = JSON.parse(error);
				// 		response = JSON.parse(response);
				// 		if(error){
				// 			res.status(500).json(error);
				// 		}else if(response.error){
				// 			res.status(500).json(response);
				// 		}else{
				// 			response.userToken = req.param('userToken');
				// 			var statusInterval = setInterval(function(){
				// 				PickupService.cabStatus(response.request_id, req.param('userToken'), function(err, statusResponse){
				// 					err = JSON.parse(err);
				// 					statusResponse = JSON.parse(statusResponse);
				// 					if(err){
				// 						res.negotiate(err);
				// 					}else if(statusResponse.error){
				// 						res.negotiate(statusResponse);
				// 					}else{
				// 						if(statusResponse.status == 'accepted'){
				// 							clearInterval(statusInterval);
				// 							var msgDataReciever = {
				// 								mobile: req.param('recieverNum'),
				// 								msg: 'Hi, '+req.param('userName')+' has sent you an Uber('+statusResponse.vehicle.make+' '+statusResponse.vehicle.model+', '+statusResponse.vehicle.license_plate+', ETA '+ statusResponse.pickup.eta+' mins) with StayClose. Call your driver on '+driver.phone_number+' now.'
				// 							};
				// 							var msgDataInitiator = {
				// 								mobile: req.param().userNum,
				// 								msg: 'Hi, '+req.param('userName')+' has sent you an Uber('+statusResponse.vehicle.make+' '+statusResponse.vehicle.model+', '+statusResponse.vehicle.license_plate+', ETA '+ statusResponse.pickup.eta+' mins) with StayClose. Call your driver on '+driver.phone_number+' now.'
				// 							};
				// 							SMSService.sendSMS(msgDataInitiator, function(err, success){
				// 								if(err){
				// 									res.negotiate(err);
				// 								}
				// 							});
				// 							SMSService.sendSMS(msgDataReciever, function(err, success){
				// 								if(err){
				// 									res.negotiate(err);
				// 								}
				// 							});
				// 						}
				// 					}
				// 				});
				// 			}, 2000);
				// 			// res.view('searching', {rideDetails: response});
				// 		}
				// 	});
				// 	//create a web view with re requests in the backgroud to check driver acceptance
				// }
			// }else if(req.param('smartFlag') == 'true'){
				// if(req.param('appFlag') == 'true'){
				// 	if(!req.param('memberUserId')){
				// 		res.badRequest('family member id must be provided');
				// 	}else{
				// 		User.getFamilyMemberLocation(req.param('memberUserId'), function(err, locationData){
				// 			if(err){
				// 				res.serverError(err);
				// 			}else{
				// 				var currentTime = Date.parse(new Date());
				// 				var lastSeen = Date.parse(locationData.createdAt);
				// 				if(currentTime - lastSeen <= 600000){
				// 					//To be decided
				// 				}
				// 				// Location.findOne({where: {user: user_id}, sort: 'createdAt desc'}).exec(function(err, userLocationData){
				// 				// 	if(err){
				// 				// 		callback(err, null);
				// 				// 	}else{
				// 				// 		callback(null, userLocationData);
				// 				// 	}
				// 				// });
				// 			}
				// 		});
				// 	}
				// }
				// else if(req.param('appFlag') == 'false'){
					var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
				  	var shortlink = '';
				  	for (var i = 0; i < 15; i++) {
				    	var p = Math.floor(Math.random() * set.length);
				    	shortlink += set[p];
				  	}

				  	var linkData = {
				  		shortLink: shortlink,
				  		token: req.param('userToken'),
				  		name: req.param('userName'),
				  		destination: req.param('destination'),
				  		destLat: req.param('destLatitude'),
				  		destLong: req.param('destLongitude'),
				  		linkExpiry: 900000,
				  		productId: req.param('productId'),
				  		recieverNum: req.param('recieverNum'),
				  		recieverName: req.param('recieverName'),
				  		initiatorImg: 'https://d1qb2nb5cznatu.cloudfront.net/users/888502-medium_jpg?1417416611',
				  		initiatorNum: req.param('userNum')
				  	};

				  	Links.createPickupLink(linkData, function(err, linkCreationResponse){
				  		if(err){
				  			res.serverError(err);
				  		}else{
				  			// var msg1 = req.param('userName')+" would like to book a cab for you. Click on the link to continue: "+baseUrl+shortlink;
				  			// var msg2 = "You have requested to book the cab for "+req.param('recieverName')+". Here is the link: "+baseUrl+shortlink;
				  			
				  			var msgDataReciever = {
								mobile: req.param('recieverNum'),
								msg: 'Hi, '+req.param('userName')+' has sent you an Uber with StayClose. Click here to accept https://52.74.30.237/booking/'+shortlink
							};

							SMSService.sendSMS(msgDataReciever, function(err, success){
								if(err){
									res.negotiate(err);
								}
							});
							res.view('booking-confirm',{status:200});
				  	// 		SMSService.send({to:req.param().recieverNum, message: msg1}, function(err, msgResponse){
							// 	if(err)
							// 		res.serverError(err);
							// });
							// SMSService.send({to:req.param().userNum, message: msg2}, function(err, msgResponse){
							// 	if(err)
							// 		res.serverError(err);
							// });
				  		}
				  	});
				// }
			// }
		// }
	},

	getRideDetails: function(req, res){
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
				sails.log.debug(response);
				res.send(response);
			}
		});
	},

	getRideTrackLink: function(req, res){
		// var initiator = User.getUser(req.body.initiatorNum, function(err, initiatorData){return initiatorData});
		// var reciever = User.getUser(req.body.recieverNum, function(err, recieverData){return recieverData});
		PickupService.getRideLink(req.body.rideId, req.body.token, function(err, response){
			err = JSON.parse(err);
			response = JSON.parse(response);
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				//uber response
				// {
				//   "request_id":"b5512127-a134-4bf4-b1ba-fe9f48f56d9d",
				//   "href":"https://trip.uber.com/abc123"
				// }
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
				var pushNotificationMessage = {
                	type: 'uber',
                	txt: 'trip link and ride id',
                	data: response
            	};
            	// PushNotificationService.sendNotification(user, pushNotificationMessage);
				res.json({success:true});
				// res.send(response);
			}
		});
	},

	cancelPickup: function(req, res){
		// needed in request - req.body.initiatorNum, recieverNum, requestId, userToken
		var initiator = User.getUser(req.body.initiatorNum, function(err, initiatorData){return initiatorData});
		var reciever = User.getUser(req.body.recieverNum, function(err, recieverData){return recieverData});
		PickupService.cancelRide(req.body.requestId, req.body.userToken, function(err, response){
			err = JSON.parse(err);
			response = JSON.parse(response);
			if(err){
				res.status(500).json(err);
			}else if(response.error){
				res.status(500).json(response.error);
			}else{
				if(origin == 'web'){
					var pushNotificationMessage = {
	                	type: 'uber',
	                	txt: 'Uber cancelled by '+reciever.first_name
	            	};
	            	PushNotificationService.sendNotification(user, pushNotificationMessage);
	            	var message = reciever.first_name+" has cancelled the Uber you had booked for them.";
			    	sails.log.debug(message, 'sending message to '+initiator.mobile);
			    	SMSService.send({to: initiator.mobile, message: message});
				}
				res.send(response);
			}
		});
	}
};
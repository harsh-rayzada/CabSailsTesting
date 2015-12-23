var interval, requestId;
$('#acceptRide').click(function(e){
	markerPick.setDraggable(false);
	$('.overlay').removeClass('hide');
	$('.searching-msg').removeClass('hide');

	var rideData = {
		productId: userData.productId,
		pickupLatitude: pickupLat,
		pickupLongitude: pickupLong,
		destLatitude: destLat,
		destLongitude: destLong,
		userToken: userData.token,
		from: 'ajax'
	};
	
	$.ajax({
		url:"/user/request",
		type: 'POST',
		// processData: false,
		data: rideData,
		success:function(resp){
			$('#searchMsg').text('Waiting for a driver to accept ');
			requestId = resp.request_id;
			interval = setInterval(checkStatus, 5000);
		},
		error: function(err){
			console.log(err);
		}
	});
});

function checkStatus(){
	$.ajax({
		url:"/user/status",
		type: 'POST',
		data:{rideId: requestId, token: userData.token},
		success:function(resp){
			if(resp.status == 'accepted'){
				clearInterval(interval);
				$('#mapDetails').addClass('hide');
				$('#rideConfirm').removeClass('hide');
				$('#rideAlert').addClass('hide');
				$('.overlay').addClass('hide');
				$('.searching-msg').addClass('hide');
				$('#driverName').text(resp.driver.name);
				$('#rating').text(resp.driver.rating);
				$('#carDetails').text(resp.vehicle.make+' '+resp.vehicle.model);
				$('#carLicense').text(resp.vehicle.license_plate);
				$('#eta').text(resp.eta);
				$('#phNum').text(resp.driver.phone_number);
				$('#driverPic').attr('src',resp.driver.picture_url);
				alert('Request successful! '+resp.driver.phone_number+' will arrive in '+resp.eta+' minutes!');
				trackRide();
			}
		}
	});
}

function trackRide(){
	$.ajax({
		url: "/user/rideTrack",
		type:'POST',
		data:{rideId: requestId, token: userData.token, recieverNum: userData.recieverNum, initiatorNum:userData.initiatorNum},
		success: function(resp){
			//Do something
			console.log(resp);
		}
	});
}

$('.product').click(function(e){
	var rideConfirm = confirm('Do you want to book this ride?');
	if(rideConfirm == true){
		// $.ajax({
		// 	url: '/user/rideLink',
		// 	type: 'POST',
		// 	data: {

		// 	},
		// 	success: function(resp){
		// 		console.log(resp);
		// 	}
		// });
		// var rideData = {
		// 	product_id: $(this).data('productid'),
		// 	start_latitude: productsData.lat,
		// 	start_longitude: productsData.long
		// 	// end_latitude: req.body.destLatitude,
		// 	// end_longitude: req.body.destLongitude
		// };

		// $.ajax({
		// 	url: 'https://sandbox-api.uber.com/v1/requests',
		// 	type: 'POST',
		// 	headers: {
		// 		'Authorization': 'Bearer '+productsData.token,
		// 		'Content-Type': 'application/json'
		// 	},
		// 	data: rideData,
		// 	success: function(resp){

		// 	}
		// })
	}
});	
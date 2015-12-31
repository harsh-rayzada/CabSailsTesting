var interval, requestId;
$('.overlay').removeClass('hide');
var elemHeight = $(window).height() - 116;
$('.ride-confirm-box').css('top',elemHeight);

// function getTimeEstimate(position, productId, token){
// 	$.ajax({
// 		url: '/pickup/nearest',
// 		type: 'POST',
// 		data: {position: position, product_id: productId, userToken: token},
// 		success: function(estimateData){
// 			// console.log(Math.ceil((estimateData[0].estimate)/60));
// 			$('#pickupTime').text('PICKUP TIME IS APPROXIMATELY '+Math.ceil((estimateData[0].estimate)/60)+' minutes');
// 			$('#currentEstimate').text('PICKUP TIME IS APPROXIMATELY '+Math.ceil((estimateData[0].estimate)/60)+' MINUTES');
// 		}
// 	});
// }

$('#acceptRide').click(function(e){
	$('.overlay').addClass('hide');
	$('.ride-alert').addClass('hide');
	$('.ride-confirm-data').removeClass('hide');
});

$('#locationPickup').click(function(e){
	$('#locationPickup').addClass('hide');
	$('#searchAddress').removeClass('hide');
});

$('#backToPickup').click(function(e){
	$('#locationPickup').removeClass('hide');
	$('#searchAddress').addClass('hide');
	if($.trim($('#searchTextField').val()) == ""){
		$('#searchTextField').val(pickUpAddress);
	}
});

$('#destination').click(function(e){
	$('#destination').addClass('hide');
	$('#searchDestAddress').removeClass('hide');
	$('#destSearch').val(destAddress);
});

$('#backToDest').click(function(e){
	$('#destination').removeClass('hide');
	$('#searchDestAddress').addClass('hide');
	if($.trim($('#destSearch').val()) == ""){
		$('#destSearch').val(userData.destination);
	}
});

$('#confirmRide').click(function(e){
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
				$('.overlay').addClass('hide');
				$('.searching-msg').addClass('hide');
				$('.ride-confirm-data').addClass('hide');
				$('.ride-success-box').removeClass('hide');
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
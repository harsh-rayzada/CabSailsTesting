var interval, requestId, counter = 0, pickupLocationInterval;
$('.overlay').removeClass('hide');
var elemHeight = $(window).height() - 116;
$('.ride-confirm-box').css('top',elemHeight);
// if((navigator.userAgent.indexOf('Safari') != -1) && (navigator.userAgent.indexOf('Chrome') == -1)) {
// 	$('.map-details').css('margin','40px auto');
// }
$('.clear-text').click(function(e){
	$(this).prev().val('').focus();
});

$('#acceptRide').click(function(e){
	$('.overlay').addClass('hide');
	$('.ride-alert').addClass('hide');
	$('.ride-confirm-data').removeClass('hide');
});

$('#locationPickup').click(function(e){
	$('#locationPickup').addClass('hide');
	$('#searchAddress').removeClass('hide');
	$('#searchTextField').focus().select();
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
	$('#destSearch').select();
});

$('#destSearch').focus(function(e){
	if(!((navigator.userAgent.indexOf('Safari') != -1) && (navigator.userAgent.indexOf('Chrome') == -1))) {
		$('.ride-alert-parent').css('top','0%');
	}
});

$('#backToDest').click(function(e){
	$('.ride-alert-parent').css('top','30%');
	$('#destination').removeClass('hide');
	$('#searchDestAddress').addClass('hide');
	if($.trim($('#destSearch').val()) == ""){
		$('#destSearch').val(userData.destination);
	}
});

$('#confirmRide').click(function(e){
	// markerPick.setDraggable(false);
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
			counter = counter + 1;
			if(resp.status == 'accepted'){
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
				if(counter == 1){
					trackRide();
				}
			}else if(resp.status == 'arriving' || resp.status == 'in_progress'){
				var pickup = new google.maps.LatLng(resp.pickup.latitude, resp.pickup.longitude);
				markerPick = new google.maps.Marker({
					position: pickup,
					label: 'Pickup Location'
					//icon: add image saying 'pickup location'
					// draggable:true
				});
				markerPick.setMap(userMap);
				pickupLocationInterval = setInterval(movePickup(resp.location),2000);
			}else if(resp.status == 'completed' || resp.status == 'driver_canceled'){
				clearInterval(interval);
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
			//Do something - not yet decided
			console.log(resp);
		}
	});
}

function movePickup(driverLocation, pickupLocation){
	// $('.centerMarker').css('background','url()')
}

// $('.product').click(function(e){
// 	var rideConfirm = confirm('Do you want to book this ride?');
// 	if(rideConfirm == true){
// 		// $.ajax({
// 		// 	url: '/user/rideLink',
// 		// 	type: 'POST',
// 		// 	data: {

// 		// 	},
// 		// 	success: function(resp){
// 		// 		console.log(resp);
// 		// 	}
// 		// });
// 		// var rideData = {
// 		// 	product_id: $(this).data('productid'),
// 		// 	start_latitude: productsData.lat,
// 		// 	start_longitude: productsData.long
// 		// 	// end_latitude: req.body.destLatitude,
// 		// 	// end_longitude: req.body.destLongitude
// 		// };

// 		// $.ajax({
// 		// 	url: 'https://sandbox-api.uber.com/v1/requests',
// 		// 	type: 'POST',
// 		// 	headers: {
// 		// 		'Authorization': 'Bearer '+productsData.token,
// 		// 		'Content-Type': 'application/json'
// 		// 	},
// 		// 	data: rideData,
// 		// 	success: function(resp){

// 		// 	}
// 		// })
// 	}
// });	
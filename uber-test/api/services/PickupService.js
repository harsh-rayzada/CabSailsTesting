var request = require('request');
//localhost:2244
exports.pickupLogin = function(code, callback){
	request
    .post('https://login.uber.com/oauth/v2/token?client_secret=CS0D2nvlx4_BRUry7GlrEjdP-Sh7sD7HNVP-Gr2g&client_id=XJyYPJd9aKwtIHRmnx_gEksS0VLQ1WHc&grant_type=authorization_code&redirect_uri=https://52.74.30.237/user/pickupLogin&code='+code, function(err, httpResp, body){
      	if(err){
      		callback(err, null);
      	}else{
      		callback(null, body);
      	}
    });
};

exports.requestRide = function(rideData, userCabToken, callback){
	request
	.post({
		url:'https://sandbox-api.uber.com/v1/requests',
		headers: {
			'Authorization': 'Bearer '+userCabToken,
			'Content-Type': 'application/json'
		},
		json: true,
		body: rideData
	},function(err, httpResp, body){
		callback(err, body);
	});
};


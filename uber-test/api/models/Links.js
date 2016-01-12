module.exports = {
	getLinkDetails: function(linkId, callback){
		var responseData = {
			token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsicHJvZmlsZSIsInJlcXVlc3QiXSwic3ViIjoiNjdjYzJhNzAtNzRlZi00NzcyLWFmMGYtNmQ3OTc3Y2IyZWY4IiwiaXNzIjoidWJlci11czEiLCJqdGkiOiIxYTJiMDRmNi1kMDA0LTQzOTktODMyNy0xYjQxNDAwYjJiMmQiLCJleHAiOjE0NTI5Mjc5ODgsImlhdCI6MTQ1MDMzNTk4NywidWFjdCI6IlV1UHRkT0poNXhYZDh1T2I3VVVQMW43REhOaXVINSIsIm5iZiI6MTQ1MDMzNTg5NywiYXVkIjoiWEp5WVBKZDlhS3d0SUhSbW54X2dFa3NTMFZMUTFXSGMifQ.dnohEmpBhw6_ya2u-ml5i0HsxuYo5CClG4w7yf10bRfpENwWopSPu--NH_1W1PaDNGUo6cBOlAT2slfC2b8cQ8_Xa1HEEwTuQdxw-wKipqBKQx9hFJAtUsm3lHMQXQ5b7RR9gaBWUoU87iDzummWRUwpZ6tY5_Qy3B4PEpYGjLL4C8TswsVoScvXgrqCi87rysdQHRLnDcegSoibONPV6YYFMTPaj3HKA6FKtxaghjLgV2KOzRY8zkhJZg5msZS0WfkiHwyDXbI9zlPPmqeYDwSTukV99PU2GMe2Aqvf3YlBV3lwRBUjPkYgzllUhqrZfqa5KGHZFmF3IYrQUVJqLA',
			name: 'Shubhankar Sarda',
			destination: 'Kereguddadahalli, Chikkabanavara, Bengaluru, Karnataka',
			destLat: 13.079424,
			destLong: 77.515566,
			linkExpiry: 600000,
			productId: 'db6779d6-d8da-479f-8ac7-8068f4dade6f',
			// if no product id then string search method
			recieverNum: 9620469791,
			recieverName: 'some name',
			initiatorNum: 8553595795,
			// pickup lat long- optional
			initiatorImg: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/2/000/000/374/0b15819.jpg'
			// http://cdns2.freepik.com/image/th/318-39535.png
		};
		// Links.findOne({shortlink:linkId}).exec(function(err, linkDetails){
		// 	if(err){
		// 		callback(err, null);
		// 	}else if(linkDetails){
		// 		callback(null, linkDetails)
		// 	}else{
		// 		callback(null, 'No such link');
		// 	}
		// });
		callback(null, responseData);
	},

	createPickupLink: function(linkData, callback){
		Links.create(linkData).exec(function(err, creationResp){
			if(err){
				callback(err, null);
			}else{
				callback(null, creationResp);
			}
		});
	}
}


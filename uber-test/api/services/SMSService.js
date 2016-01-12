var request = require('request');
exports.sendSMS = function(msgData, cb){
	request
	.get({
		url: 'http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=l5qocIeLNz1&MobileNo='+msgData.mobile+'&SenderID=TCHKIN&Message='+msgData.msg+'&ServiceName=TEMPLATE_BASED'
	},function(err, httpResp, body){
		if(err){
			callback(err, null);
		}else{
			callback(null, body);
		}
	});
}
var request = require('request');

exports.pickupLogin = function(code, callback){
	request
    .post('https://login.uber.com/oauth/v2/token?client_secret=CS0D2nvlx4_BRUry7GlrEjdP-Sh7sD7HNVP-Gr2g&client_id=XJyYPJd9aKwtIHRmnx_gEksS0VLQ1WHc&grant_type=authorization_code&redirect_uri=http://localhost:2244/user/pickupLogin&code='+code, function(err, httpResp, body){
      if(err){
      	callback(err, null);
      }else{
      	callback(null, body);
      }
    });
}
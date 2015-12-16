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
	        if(err){
	          res.status(500).json(JSON.parse(err));
	        }else{
	          var response = JSON.parse(body);
	          sails.log.debug(response);
	          res.view('home',{accessToken: response.access_token, refreshToken: response.refresh_token});
	        }
	      });
	    }else{
	      res.json(req.param.all());
	    }
	}
};
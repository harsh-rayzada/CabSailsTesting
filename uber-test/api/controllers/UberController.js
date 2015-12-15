/**
 * UberController
 *
 * @description :: Server-side logic for managing Ubers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getCode: function(req, res){
		var code = req.params.all();
		res.send(code);
	}
};


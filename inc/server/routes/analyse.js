var AnalyseController = require('../controllers/AnalyseController');

module.exports = function(app, options){

	var ctrl = new AnalyseController(app, options),
		process = function(req, res){
			if(!req.body.query){
				return res.json({
					success: false,
					message: 'The query property is required but was not found in the request body'
				});
			}

			ctrl.analyse(req.body.query, req.params.requestId || null, function(result){
				res.json(result);
			});
		};

	app.post('/analyse', process);
	app.post('/analyse/:requestId', process);
};
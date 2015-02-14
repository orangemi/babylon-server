var Router = require('../lib/Router');

var router = module.exports = new Router();

router.get('/', function(req, res) {
// router.get(/.*/, function(req, res) {
	console.log('this is my homepage');
	res.end();
});
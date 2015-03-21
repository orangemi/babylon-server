var Then = require('thenjs');
var Router = require('../lib/Router');
var User = require('../lib/User');
var Task = require('../lib/Task');
var Organization = require('../lib/Organization');
var extend = require('../lib/extend');
var Session = require('../lib/Session');

var router = module.exports = new Router();

router.use('/:anything*', function(req, res, next) {
	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, userId) {
		User.load(userId, then);
	}).then(function(then, user) {
		req.user = user;
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		res.end();
	}).finally(function() {
		next();
	});
}, { wait: true });

router.get('/', function(req, res) {
	Then(function(then) {
		Organization.findByUser(req.user, then);
	}).then(function(then, organizations) {
		var result = req.user.display();
		result.organizations = [];
		organizations.forEach(function(organization) {
			result.organizations.push(organization.display());
		});
		res.json(result);
		res.end();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		res.end();
	}).finally(function() {
		next();
	});
});

router.get('/organization', function(req, res) {
	Then(function(then) {
		Organization.findByUser(req.user, then);
	}).then(function(then, organizations) {
		var result = [];
		organizations.forEach(function(organization) {
			result.push(organization.display());
		});
		res.json(result);
		res.end();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		res.end();
	}).finally(function() {
		next();
	});
});
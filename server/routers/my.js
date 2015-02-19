var Then = require('thenjs');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

var Session = require('../session');

var router = module.exports = new Router();

router.get('/', function(req, res) {
	Then(function(then) {
		var session = req.cookie.session;
		var personId = Session.get(session);
		if (!personId) throw new Error('Invalid session or expired!');
		Person.load(personId, then);
	}).then(function(then, person) {
		if (person.status != Person.STATUS.NORMAL) throw new Error('Invalid User');
		res.write('this is my homepage #' + personId);
		then();
	}).catch(function(then, error) {
		res.write(error.toString());
		then();
	}).finally(function() {
		res.end();
	});
});

router.get('/task', function(req, res) {
	Then(function(then) {
		Person.load(1, then);
	}).then(function(then, person) {
		Task.findByPerson(person, then);
	}).then(function(then, tasks) {
		res.json(tasks);
		then();
	}).finally(function() {
		res.end();
	});
});

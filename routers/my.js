var Then = require('thenjs');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');
var extend = require('../lib/extend.js');

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
		res.json({ error: error.toString() });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get('/task', function(req, res) {
	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Person.load(personId, then);
	}).then(function(then, person) {
		Task.findByPerson(person, then);
	}).then(function(then, tasks) {
		var result = [];
		tasks.forEach(function(task, i) {
			var t = task.display();
			t.sort = i + 1;
			result.push(t);
		});
		res.json(result);
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		then();
	}).finally(function() {
		res.end();
	});
});

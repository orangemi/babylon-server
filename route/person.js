var Then = require('thenjs');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');
var extend = require('../lib/extend');
var Session = require('../lib/Session');

var router = module.exports = new Router();

// router.get('/', function(req, res) {
router.get(/^\/(\d+)\/?$/, function(req, res) {
	var id = req.match[1];
	// var current_person;
	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then) {
		Person.load(id, then);
	}).then(function(then, person) {
		if (person.status != Person.STATUS.NORMAL) throw new Error('Invalid User');
		res.json(person.display());
		//res.write('this is my homepage #' + personId);
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		then();
	}).finally(function() {
		res.end();
	});
});

// router.get('/task', function(req, res) {
router.get(/^\/(\d+)\/task\/?$/, function(req, res) {
	var id = req.match[1];
	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then) {
		Person.load(id, then);
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

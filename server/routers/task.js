var Then = require('thenjs');

var Session = require('../session');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

var router = module.exports = new Router();

router.post('/', function(req, res) {
	var current_task;
	var current_person;
	// console.log(id, req);

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		req.getBody(then);
	}).then(function(then, post) {
		post = JSON.parse(post);
		var task = new Task();
		task.creator = person.id;
		task.title = post.title || '';
		task.description = post.description || '';
		task.status = Task.STATUS.NORMAL;
		task.type = Task.TYPE.TASK;
		task.complete = Task.COMPLETE.INCOMPLETE;
		task.save(then);
	}).then(function(then, task) {
		res.json(task.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		then();
	}).finally(function() {
		res.end();
	});
});

router.post(/^\/(\d+)\/parent\/?$/, function(req, res) {
	var id = req.match[1];
	var sort;
	var parent;
	var current_task;
	var parent_task;

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Task.load(id, then);
	}).then(function(then, task) {
		current_task = task;
		req.getBody(then);
	}).then(function(then, post) {
		post = JSON.parse(post);
		var parent_id = post.parent;
		sort = post.sort || 1;
		Task.load(parent_id, then);
	}).then(function(then, task) {
		parent_task = task;
		current_task.parentTo(task, sort, then);
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get(/^\/(\d+)\/sub\/?$/, function(req, res) {
	var id = req.match[1];

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Task.load(id, then);
	}).then(function(then, task) {
		Task.findByTask(task, then);
	}).then(function(then, tasks) {
		var result = [];
		tasks.forEach(function(task, i) {
			result.push(extend({ sort: i + 1 }, task.display()));
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

router.post(/^\/(\d+)\/?$/, function(req, res) {
	console.log(req.match);
	var id = req.path[2];
	var current_task;
	var current_person;

	Then(function(then) {
		var personId = Session.get(req.cookie.session);
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		var task = new Task();
		task.creator = person.id;
		task.save(then);
	}).then(function(then, task) {
		current_task = task;
		task.assignTo(current_person, 1, then);
	}).then(function(then, task) {
		res.write(JSON.stringify(task.display()));
		then();
	}).finally(function() {
		res.end();
	});
});
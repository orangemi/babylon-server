var Then = require('thenjs');

var Session = require('../session');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

var router = module.exports = new Router();

router.post(/^\/((\d+)\/?)?$/, function(req, res) {
	var current_task;
	var current_person;
	var id = req.match[2];
	var post;

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		if (id) Task.load(id, then);
		else then(null, new Task());
	}).then(function(then, task) {
		current_task = task;
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);

		var task = current_task;
		task.creator = post.creator || task.creator || current_person.id;
		task.title = post.title || task.title || '';
		task.description = post.description || task.description || '';
		task.status = post.status || task.status || Task.STATUS.NORMAL;
		task.type = post.type || task.type || Task.TYPE.TASK;
		task.complete = post.complete || task.complete || Task.COMPLETE.INCOMPLETE;
		task.save(then);

	}).then(function(then, task) {
		res.json(task.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.post(/^\/(\d+)\/assign\/?$/, function(req, res) {
	var id = req.match[1];
	var post;
	var current_person;
	var current_task;

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		Task.load(id, then);
	}).then(function(then, task) {
		current_task = task;
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);
		if (post.type == 'my') then();
		else if (post.type == 'person') Person.load(post.target, then);
		else if (post.type == 'task') Task.load(post.target, then);
	}).then(function(then, target) {
		if (post.type == 'my') current_task.assignToPerson(current_person, post.sort, then);
		else if (post.type == 'person') current_task.assignToPerson(target, post.sort, then);
		else if (post.type == 'task') current_task.assignToTask(target, post.sort, then);
	}).then(function(then) {
		res.json({});
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
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
			var t = task.display();
			t.sort = i + 1;
			result.push(t);
		});
		res.json(result);
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

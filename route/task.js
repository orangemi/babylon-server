var Then = require('thenjs');
var extend = require('../lib/extend');
var Session = require('../lib/Session');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');
var History = require('../lib/History');
var Tag = require('../lib/Tag');

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
		task.createtime = post.createtime || task.createtime || Math.floor(Date.now() / 1000);
		task.updatetime = post.updatetime || task.updatetime || Math.floor(Date.now() / 1000);
		task.scheduletime = post.scheduletime || task.scheduletime || 0;
		task.save(then);

	}).then(function(then, task) {
		//TODO if need assign then assign
		then(null, task);
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

router.all(/^\/(\d+)\/assign\/?$/, function(req, res) {
	var id = req.match[1];
	var post;
	var current_person;
	var current_task;

	Then(function(then) {
		if (req.method != 'post' && req.method != 'delete') throw "only support `post` and `delete` method";
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
		if (post.type == 'my') then(null, current_person);
		else if (post.type == 'person' && req.method == 'delete') then(null, current_person);
		else if (post.type == 'person' && req.method == 'post') Person.load(post.target, then);
		else if (post.type == 'task') Task.load(post.target, then);
	}).then(function(then, target) {
		var options = {};
		if (req.method == 'delete') options = { del: true };
		var sort = post.sort || 1;
		if (post.type == 'person') current_task.assignToPerson(target, sort, options, then);
		else if (post.type == 'task') current_task.assignToTask(target, sort, options, then);
	}).then(function(then) {
		res.json({});
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get(/^\/(\d+)\/tag\/?$/, function(req, res) {
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

		Tag.find({
			task_id: current_task.id,
			status: Tag.STATUS.NORMAL,
		}, then);

	}).then(function(then, tags) {
		var result = [];
		tags.forEach(function(tag) {
			result.push(tag.display());
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

router.post(/^\/(\d+)\/tag\/?$/, function(req, res) {
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
		name = post.name;
		if (!name) throw 'no tag name passed';

		Tag.find({
			task_id: current_task.id,
			name: name,
			status: Tag.STATUS.NORMAL,
		}, then);
	}).then(function(then, tags) {
		if (tags.length) throw 'tag already exists';
		
		var tag = new Tag();
		tag.task_id = current_task.id;
		tag.organization_id = current_task.organization_id;
		tag.status = Tag.STATUS.NORMAL;
		tag.name = post.name;
		tag.createtime = Math.floor(Date.now() / 1000);
		tag.updatetime = Math.floor(Date.now() / 1000);
		tag.save(then);

	}).then(function(then, tag) {
		res.json(history.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get(/^\/(\d+)\/comment\/?$/, function(req, res) {
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

		History.find({
			task_id: current_task.id,
			type: History.TYPE.COMMENT,
			status: History.STATUS.NORMAL,
		}, {
			orderby: 'createtime',
			order: 'desc',
		}, then);

	}).then(function(then, comments) {
		var result = [];
		comments.forEach(function(comment) {
			result.push(comment.display());
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


router.post(/^\/(\d+)\/comment\/?$/, function(req, res) {
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

		var comment = new History();
		comment.creator = current_person.id;
		comment.task_id = current_task.id;
		comment.type = History.TYPE.COMMENT;
		comment.status = History.STATUS.NORMAL;
		comment.message = post.message;
		comment.createtime = Math.floor(Date.now() / 1000);
		comment.updatetime = Math.floor(Date.now() / 1000);
		comment.save(then);

	}).then(function(then, history) {
		res.json(history.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get(/^\/(\d+)\/parent\/?$/, function(req, res) {
	var id = req.match[1];

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Task.load(id, then);
	}).then(function(then, task) {
		Task.findByTask(task, { type: 'parent' }, then);
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

router.get(/^\/(\d+)\/sub\/?$/, function(req, res) {
	var id = req.match[1];

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Task.load(id, then);
	}).then(function(then, task) {
		Task.findByTask(task, { type: 'sub' }, then);
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

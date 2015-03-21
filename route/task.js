var Then = require('thenjs');
var extend = require('../lib/extend');
var Session = require('../lib/Session');
var Router = require('../lib/Router');
var User = require('../lib/User');
var Task = require('../lib/Task');
var History = require('../lib/History');
var Tag = require('../lib/Tag');

var router = module.exports = new Router();

router.get('/', function(req, res) {
	Then(function(then) {
		var organization_id = req.organization.id;
		//var organization_id = req.params.organization_id;
		var parentTask = new Task();
		parentTask.id = 0;
		parentTask.organization_id = organization_id;
		Task.findByTask(parentTask, { type: 'sub' }, then);
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

router.use(/^\/(\d+)/, function(req, res, next) {
	req.params.task_id = req.matchedResult[1];
	Then(function(then) {
		Task.load(req.params.task_id, then);
	}).then(function(then, task) {
		if (task.organization_id != req.organization.id) throw 'organization error';
		req.task = task;
		then();		
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		res.end();
	}).finally(function() {
		next();
	});
}, { wait: true });

router.post(/^\/((\w+)\/?)?$/, function(req, res) {
	var id = req.match[2];
	var post;

	Then(function(then) {
		if (!id) {
			var task = req.task = new Task();
			task.organization_id = req.organization.id;
			task.creator = req.user.id;
		}
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);

		var task = req.task;
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

router.all('/:task_id/assign', function(req, res) {
	var post;

	Then(function(then) {
		if (req.method.toLowerCase() != 'post' && req.method.toLowerCase() != 'delete') throw "only support `post` and `delete` method";
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);
		if (post.type == 'my') then(null, req.user);
		else if (post.type == 'user' && req.method.toLowerCase() == 'delete') then(null, req.user);
		else if (post.type == 'user' && req.method.toLowerCase() == 'post') User.load(post.target, then);
		else if (post.type == 'task') Task.load(post.target, then);
	}).then(function(then, target) {
		var options = {};
		if (req.method.toLowerCase() == 'delete') options = { del: true };
		var sort = post.sort || 1;
		if (post.type == 'user') req.task.assignToUser(target, sort, options, then);
		else if (post.type == 'task') req.task.assignToTask(target, sort, options, then);
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

router.get('/:task_id/tag', function(req, res) {
	Then(function(then) {
		Tag.find({
			task_id: req.task.id,
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

router.post('/:task_id/tag', function(req, res) {
	var post;

	Then(function(then) {
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);
		name = post.name;
		if (!name) throw 'no tag name passed';

		Tag.find({
			task_id: req.task.id,
			name: name,
			status: Tag.STATUS.NORMAL,
		}, then);
	}).then(function(then, tags) {
		if (tags.length) throw 'tag already exists';
		
		var tag = new Tag();
		tag.task_id = req.task.id;
		tag.organization_id = req.task.organization_id;
		tag.status = Tag.STATUS.NORMAL;
		tag.name = post.name;
		tag.createtime = Math.floor(Date.now() / 1000);
		tag.updatetime = Math.floor(Date.now() / 1000);
		tag.save(then);

	}).then(function(then, tag) {
		// res.json(history.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.get('/:task_id/comment', function(req, res) {
	Then(function(then) {
		History.find({
			task_id: req.task.id,
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


router.post('/:task_id/comment', function(req, res) {
	var id = req.params.task_id;
	var post;

	Then(function(then) {
		req.getBody(then);
	}).then(function(then, body) {
		post = JSON.parse(body);

		var comment = new History();
		comment.creator = req.user.id;
		comment.task_id = req.task.id;
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

router.get('/:task_id/parent', function(req, res) {
	Then(function(then) {
		Task.findByTask(req.task, { type: 'parent' }, then);
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

router.get('/:task_id/sub', function(req, res) {
	Then(function(then) {
		console.log(req.task);
		Task.findByTask(req.task, { type: 'sub' }, then);
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

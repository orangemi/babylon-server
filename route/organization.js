var Then = require('thenjs');
var Router = require('../lib/Router');
var User = require('../lib/User');
var Organization = require('../lib/Organization');
var Task = require('../lib/Task');
var extend = require('../lib/extend');
var Session = require('../lib/Session');

var router = module.exports = new Router();

router.use('/:anything*', function(req, res, next) {
	Then(function(then) {
		if (!req.params.organization_id) throw "no organization_id";
		Session.get(req.cookie.session, then);
	}).then(function(then, userId) {
		Then.parallel([
			function(then) {
				User.load(userId, then);
			},
			function(then) {
				Organization.load(req.params.organization_id, then);
			},
		]).then(function(pthen, list) {
			then(null, list[0], list[1]);
		});
	}).then(function(then, user, organization) {
		req.user = user;
		req.organization = organization;
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString() });
		res.end();
	}).finally(function() {
		next();
	});
}, { wait: true });

router.get('/mytask', function(req, res) {
	Then(function(then) {
		Task.findByUser(req.user, req.organization, then);
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

router.get('/user/:user_id/task', function(req, res) {
	var user_id = req.params.user_id;
	Then(function(then) {
		User.load(user_id, then);
	}).then(function(then, user) {
		Task.findByUser(user, req.organization, then);
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


router.post('/search', function(req, res) {
	var post;
	var current_user;
	var current_task;

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, userId) {
		User.load(userId, then);
	}).then(function(then, user) {
		current_user = user;
		req.getBody(then);
	}).then(function(then, body) {
		post = body ? JSON.parse(body) : {};
		then();
	}).parallel([
		function(then) {
			if (post.types.indexOf('task') == -1) return then(null, []);
			Task.find({
				status : Task.STATUS.NORMAL,
				//organization_id : post.organization_id,
				'title LIKE' : ['%', post.word, '%'].join(''),
				//TODO may be need to add description search...
			}, then);
		},
		function(then) {
			if (post.types.indexOf('user') == -1) return then(null, []);
			User.find({
				status : User.STATUS.NORMAL,
				//organization_id : post.organization_id,
				'email LIKE' : ['%', post.word, '%'].join(''),
				//TODO may be need to add nickname search...
			}, then);
		}, 
		// function(then) {}, //TODO add find tag
		// function(then) {}, //TODO add find comment (very late)
	]).then(function(then, list) {
		var result = {};
		var types = ['task', 'user'];
		list.forEach(function(list, i) {
			var type = types[i];
			if (!type) return;
			result[type] = [];
			list.forEach(function(line) {
				result[type].push(line.display());
			});
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

router.use('/task', require('./task'));
// router.use('/user', require('./user'));
var Http = require('http');
var Url = require('url');
var fs = require('fs');

var Then = require('thenjs');

var Router = require('./lib/Router');
var Person = require('./lib/Person');
var Task = require('./lib/Task');
var Session = require('./lib/Session');

var httpServer = new Http.Server();
var router = new Router(httpServer);

router.get('/', function(req, res) {
	req.pathname = '/index.html';
	router.process(req, res);
});

//static file
router.get(/\.\w+$/, function(req, res) {
	var pathname = req.pathname;
	var basedir = './public';
	Then(function(then) {
		fs.readFile(basedir + pathname, then);
	}).then(function(then, result) {
		var mime = require('mime').lookup(pathname);
		res.setHeader('Content-Type', mime);
		res.write(result);
		then();
	}).catch(function(then, error) {
		console.error(error);
		res.status(404, 'File not Found');
		res.statusCode = 404;
		res.write('File not Found');
		then();
	}).finally(function(then) {
		res.end();
	});
});

router.get('/login', function(req, res) {
	// var cookie = Router.getCookie(req);
	var email = req.query.email || '';
	var password = req.query.password || '';

	Then(function(then) {
		if (!email) throw new Error('no email');
		Person.find({
			email: email,
		}, {}, then);
	}).then(function(then, persons) {
		var person = persons[0];
		// console.log(persons);
		if (!person) throw new Error('no user');
		if (person.status != Person.STATUS.NORMAL) throw new Error('user status freeze');
		if (person.password != password) throw new Error('password wrong');
		return then(null, person);
	}).then(function(then, person) {
		var session = Session.set(person.id);
		res.setCookie('session', session);
		res.json(person.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.post('/search', function(req, res) {
	var post;
	var current_person;
	var current_task;

	Then(function(then) {
		Session.get(req.cookie.session, then);
	}).then(function(then, personId) {
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		req.getBody(then);
	}).then(function(then, body) {
		post = body ? JSON.parse(body) : {};
		then();
	}).parallel([
		function(then) {
			if (post.types.indexOf('task') == -1) then(null, []);
			Task.find({
				status : Task.STATUS.NORMAL,
				//organization_id : post.organization_id,
				'title LIKE' : ['%', post.word, '%'].join(''),
				//TODO may be need to add description search...
			}, then);
		},
		// function(then) {}, //TODO add find tag
		// function(then) {}, //TODO add find comment (very late)
	]).then(function(then, list) {
		var result = {};
		var types = ['task'];
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

router.use('/my', require('./route/my'));
router.use('/task', require('./route/task'));

httpServer.listen(3000);
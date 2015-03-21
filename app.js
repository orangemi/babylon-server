var Http = require('http');
var Url = require('url');
var fs = require('fs');

var Then = require('thenjs');

var Router = require('./lib/Router');
var User = require('./lib/User');
var Session = require('./lib/Session');

var httpServer = new Http.Server();
var router = new Router(httpServer);

router.use('/:anything*', function(req, res) {
	console.log(req.method, req.url);
});

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
		User.find({
			email: email,
		}, {}, then);
	}).then(function(then, users) {
		var user = users[0];
		// console.log(users);
		if (!user) throw new Error('no user');
		if (user.status != User.STATUS.NORMAL) throw new Error('user status freeze');
		if (user.password != password) throw new Error('password wrong');
		return then(null, user);
	}).then(function(then, user) {
		var session = Session.set(user.id);
		res.setCookie('session', session);
		res.json(user.display());
		then();
	}).catch(function(then, error) {
		res.json({ error: error.toString(), stack: error.stack });
		then();
	}).finally(function() {
		res.end();
	});
});

router.use(/^\/(\d+)/, function(req, res) {
	req.params.organization_id = req.matchedResult[1];
});

router.use(/^\/(\d+)/, require('./route/organization'));
router.use('/my', require('./route/my'));

httpServer.listen(3000);
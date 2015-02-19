var Http = require('http');
var Url = require('url');
var fs = require('fs');

var Then = require('thenjs');

var Router = require('./lib/Router');
var Person = require('./lib/Person');
var Session = require('./session');

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
		Person.find({email:email}, then);
	}).then(function(then, persons) {
		var person = persons[0];
		// console.log(persons);
		if (!person) throw new Error('no user');
		if (person.password != password) throw new Error('password wrong');
		return then(null, person);
	}).then(function(then, person) {
		var session = Session.set(person.id);
		res.setCookie('session', session);
		// res.setHeader('Set-Cookie', []);
		res.write('login success');
		then();
	}).catch(function(then, error) {
		console.error(error.stack);
		res.write(error.toString());
		res.write(error.stack.toString());
		then();
	}).finally(function() {
		res.end();
	});
});

router.use('/my', require('./routers/my'));
router.use('/task', require('./routers/task'));

httpServer.listen(3000);
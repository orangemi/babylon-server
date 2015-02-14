var Http = require('http');
var Url = require('url');
var Then = require('thenjs');
var Router = require('./lib/Router');

var httpServer = new Http.Server();
var router = new Router(httpServer);

var Person = require('./lib/Person');
var myRouter = require('./routers/my');

router.get('/', function(req, res) {
	res.write('index');
	res.end();
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
		res.write('login success');
		then();
	}).catch(function(then, error) {
		res.write(error.toString());
		then();
	}).finally(function() {
		res.end();
	});
});

router.addCallback('all', '/my/*', myRouter);

httpServer.listen(3000);
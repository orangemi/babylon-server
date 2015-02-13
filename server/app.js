var Http = require('http');
var Url = require('url');
var Router = require('./lib/Router');
var httpServer = new Http.Server();

var router = new Router(httpServer);

router.get('/', function(req, res) {
	res.write('ok');
	res.end();
});

router.get('/login', function(req, res) {
	var cookie = Router.getCookie(req); //.headers.cookie;

	res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	res.end();
});

router.get('/my', function(req, res) {
	res.end();
});

httpServer.listen(3000);
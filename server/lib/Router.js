var Http = require('http');
var Url = require('url');

var Router = function(httpServer) {
	this.callbacks = [];
	this.init(httpServer);
};

Router.prototype.init = function(httpServer) {
	var self = this;
	httpServer.on('request', function(req, res) {
		var url = Url.parse(req.url, true);
		var method = req.method;
		self.process(method, url.pathname, req, res);
	});
};

Router.prototype.process = function(method, path, req, res) {
	var matched = false;
	this.callbacks.forEach(function(callback) {
		if (
			callback.reg.test(path) &&
			(callback.method = 'all' || callback.method == method.toString().toLowerCase())) {
			matched = true;
			callback.func(req, res);
//			return false;
		}
	});

	if (!matched) {
		res.statusCode = 404;
		res.end();
	}
};

Router.prototype.get = function(reg, func) {
	this.addCallback('get', reg, func);
};

Router.prototype.post = function(reg, func) {
	this.addCallback('post', reg, func);
};

Router.prototype.addCallback = function(method, reg, func) {
	if (typeof(reg) == 'string') {
		reg = new RegExp('^' + reg.replace('/','\\/') + '\\/?$');
	}
	this.callbacks.push({
		method: method.toString().toLowerCase(),
		reg: reg,
		func: func,
	});
};

Router.getCookie = function(req) {
	var cookie = req.header.cookie;
//	if (!cookie || cookie)
}

module.exports = Router;
var Http = require('http');
var Url = require('url');

var _extend = function(obj) {
	var forEach = Array.prototype.forEach;
	forEach.call(
		Array.prototype.slice.call(arguments, 1),
		function(source) {
		if (source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		}
	});
	return obj;
};

var Request = function(req, options) {
	this.init(req, options);
};

Request.prototype.init = function(req, options) {
	options = options || {};

	if (req instanceof Request) {
		this.request = req.request;

		this.method = req.method;
		this.url = req.url;
		this.path = _extend([], req.path);
		this.path.splice(1, options.pathShift || 0);
		if (this.path.length == 1) this.path.push('');
		this.pathname = this.path.join('/');
		this.query = _extend({}, req.query);
		//TODO: cookie

	} else if (req instanceof Http.IncomingMessage) {
		this.request = req;

		this.method = req.method;
		this.url = Url.parse(req.url, true);
		this.pathname = this.url.pathname.replace(/\/$/, '');
		this.path = this.pathname.split('/');
		this.query = this.url.query;
		//TODO: cookie

	} else {
		throw new Error('unknown request ' + req);
	}

};

var Router = function(httpServer, options) {
	this.init(httpServer, options);
};

Router.prototype.init = function(httpServer, options) {
	this.isRoot = false;
	this.callbacks = [];
	if (httpServer) this.setHttpServer(httpServer);
};

Router.prototype.setHttpServer = function(httpServer) {
	var options = options || {};
	var self = this;

	if (!(httpServer instanceof Http.Server)) throw new Error('not find httpServer');

	this.isRoot = true;
	httpServer.on('request', function(req, res) {
		self.process(new Request(req), res);
	});
};

Router.prototype.process = function(req, res) {
	var self = this;
	var pathname = req.pathname;
	var matched = false;
	this.callbacks.forEach(function(callback) {
		var reg = callback.reg;
		if (
			reg.test(pathname) &&
			(callback.method = 'all' || callback.method == method.toString().toLowerCase())) {
			var handler = callback.handler;
			if (handler instanceof Router) {
				// var pathSplit = reg.exec(pathname)[1];
				var result = handler.process(new Request(req, {pathShift : callback.splice}), res);
				matched = matched || result;
			} else {
				handler.apply(self, [new Request(req), res]);
				matched = true;
			}
		}
	});

	if (this.isRoot && !matched) {
		res.statusCode = 404;
		res.end('Page not found');
	}

	return matched;
};

Router.prototype.get = function(reg, func) {
	this.addCallback('get', reg, func);
};

Router.prototype.post = function(reg, func) {
	this.addCallback('post', reg, func);
};

Router.prototype.addCallback = function(method, reg, handler) {
	var splice = 0;
	if (typeof(reg) == 'string') {
		if (reg[0] !== '/') throw new Error('regex need / at first');
		if (reg.substr(-2) == '/*') {
			splice = reg.split('/').length - 2;
			reg = reg.replace(/\/\*$/, '(|/*)');
		}
		reg = reg.replace(/\//g, '\\/').replace(/\?/g, '.').replace(/\*/g, '.*');
		reg = new RegExp('^' + reg + '\\/?$');
	} else if (reg instanceof RegExp) {

	} else {
		throw new Error('unknown regex');
	}

	if (typeof(handler) != 'function' && !(handler instanceof Router)) throw new Error('handler is not a Router or function');
	this.callbacks.push({
		method: method.toString().toLowerCase(),
		reg: reg,
		splice : splice,
		handler: handler,
	});
};

module.exports = Router;
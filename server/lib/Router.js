var Http = require('http');
var Url = require('url');
var path2rexep = require('path-to-regexp');

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
		this.headers = req.headers;
		this.cookie = req.cookie;
		this.url = req.url;
		this.pathname = options.prefix ? req.pathname.substring(options.prefix.length) : req.pathname;
		this.path = this.pathname.split('/');
		this.query = _extend({}, req.query);
		//TODO: cookie
	} else if (req instanceof Http.IncomingMessage) {
		this.request = req;

		this.method = req.method;
		this.url = Url.parse(req.url, true);
		this.pathname = this.url.pathname;
		this.path = this.pathname.split('/');
		this.query = this.url.query;
		this.headers = req.headers;
		this.cookie = (function(line) {
			var cookie = {};
			if (!line) return cookie;
			line.toString().split(';').forEach(function(kv) {
				kv = kv.split('=');
				cookie[kv[0].trim()] = kv[1].trim();
			});
			return cookie;
		})(req.headers.cookie);
		//TODO: cookie

	} else {
		throw new Error('unknown request ' + req);
	}

};

var Response = function(res, options) {
	this.init(res, options);
};

Response.prototype.init = function(res, options) {
	if (res instanceof Response) {
		this.response = res.response;
		this.cookie = res.cookie;
	} else if (res instanceof Http.ServerResponse) {
		this.response = res;
		this.cookie = {};
	} else {
		throw new Error('res is not a Response');
	}
};

Response.prototype.setCookie = function(key, value, expire, path) {
	this.cookie[key] = {
		value: value,
		expire: expire || 0,
		path: path || '/',
	};
	var cookies = [];
	for (var name in this.cookie) {
		var cookie = this.cookie[name];
		cookies.push(name + '=' + cookie.value + (cookie.path ? '; Path=/' : '') + (cookie.expire ? '; Expires=Date' : ''));
	}
	this.setHeader('Set-Cookie', cookies);
	return this;
};

Response.prototype.status = function(statusCode, statusMessage) {
	this.response.statusCode = statusCode;
	if (statusMessage) this.response.statusMessage = statusMessage;
};

Response.prototype.setHeader = function(key, value) {
	return this.response.setHeader(key, value);
};

Response.prototype.write = function(buffer) {
	return this.response.write(buffer);
};

Response.prototype.json = function(json) {
	this.setHeader('Content-Type', 'application/json');
	return this.write(JSON.stringify(json));
};

Response.prototype.end = function(buffer) {
	return this.response.end(buffer);
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
		self.process(new Request(req), new Response(res));
	});
};

Router.prototype.process = function(req, res) {
	var self = this;
	var pathname = req.pathname;
	var method = req.method;
	var matched = false;
	var path;
	this.callbacks.forEach(function(callback) {
		var reg = callback.reg;
		// console.log(pathname, reg, reg.exec(pathname));
		if (
			(path = reg.exec(pathname)) &&
			(callback.method == 'all' || callback.method == method.toString().toLowerCase())) {
			var handler = callback.handler;
			if (handler instanceof Router) {
				var result = handler.process(new Request(req, {prefix: path[0]}), res);
				matched = matched || result;
			} else if (typeof(handler) == 'function') {
				handler.apply(self, [new Request(req), new Response(res)]);
				matched = true;
			} else {
				console.error('path handler is not a function or a Router for ' + pathname);
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

Router.prototype.use = function(string, router) {
	if (!(router instanceof Router)) throw new Error('router is not a Router');
	this.addCallback('all', string, router, {end: false});
};

Router.prototype.addCallback = function(method, reg, handler, options) {
	options = options || {};
	var splice = 0;
	reg = path2rexep(reg, options);
	this.callbacks.push({
		method: method.toString().toLowerCase(),
		reg: reg,
		splice : splice,
		handler: handler,
	});

};

module.exports = Router;
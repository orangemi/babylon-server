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
	this.routes = [];
	this.params = {};

	if (!(req instanceof Http.IncomingMessage)) throw "unknown request";

	var url = Url.parse(req.url, true);

	this.request = req;
	this.method = req.method;
	this.url = req.url;
	this.pathname = url.pathname;
	this.path = this.pathname.split('/');
	this.query = url.query;
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
};

Request.prototype.match = function(reg, match) {
	var params = this.params;
	var keys = reg.keys || [];
	this.matchedResult = match;
	keys.forEach(function(key, idx) {
		params[key.name] = match[idx + 1];
	});
};

Request.prototype.removePrefix = function(prefix) {
	if (prefix) this.pathname = this.pathname.substring(prefix.length);
	if (!this.pathname) this.pathname = '/';
};

Request.prototype.getBody = function(next) {
	//TODO direct output the body if body already read
	
	var buffer = '';
	this.request.on('data', function(data) {
		buffer += data;
	});
	this.request.once('end', function() {
		next(null, buffer.toString());
	});
};

//--------------------------------------------------------

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

//--------------------------------------------------------

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
		req = new Request(req);
		res = new Response(res);
		self.process(req, res, function(err) {
			if (err && !err.matched) {
				res.statusCode = 404;
				res.end('Page not found');
			}
		});
	});
};

Router.prototype.process = function(req, res, done) {
	var self = this;
	var pathname = req.pathname;
	var method = req.method;
	var match;
	var matched = false;

	var length = this.callbacks.length;
	var idx = 0;
	var next = function(err) {
		var callback;
		err = err || {};
		if (idx >= self.callbacks.length) return done(err);

		while (callback = self.callbacks[idx++]) {
			var reg = callback.reg;
			match = reg.exec(pathname);
// console.log(pathname, reg, match);

			if (!match) continue;
			if (callback.method != 'all' && callback.method != method.toString().toLowerCase()) continue;

			var handler = callback.handler;
			if (handler instanceof Router) {
				req.match(reg, match);
				req.removePrefix(match[0]);
				handler.process(req, res, next);
				matched = matched || !callback.middle;
			} else if (typeof(handler) == 'function') {
				req.match(reg, match);
				handler.apply(self, [req, res, next]);
				matched = matched || !callback.middle;
			} else {
				console.error('path handler is not a function or a Router for ' + pathname);
			}

			if (callback.wait) return;
		}

		err.matched = err.matched || matched;
// console.log(err);
		done(err);
	};

	next();
};

Router.prototype.get = function(reg, func) {
	return this.addCallback('get', reg, func);
};

Router.prototype.post = function(reg, func) {
	return this.addCallback('post', reg, func);
};

Router.prototype.delete = function(reg, func) {
	return this.addCallback('delete', reg, func);
};

Router.prototype.all = function(reg, func, options) {
	return this.addCallback('all', reg, func, options);
};

Router.prototype.use = function(reg, func, options) {
	if (func instanceof Router)  options = _extend({ wait: true, end: false, }, options);
	return this.addCallback('all', reg, func, _extend({ middle : true, }, options));
};

Router.prototype.addCallback = function(method, reg, handler, options) {
	options = options || {};
	reg = path2rexep(reg, options);
	this.callbacks.push({
		method: method.toString().toLowerCase(),
		reg: reg,
		handler: handler,
		wait: !!options.wait,
		middle: options.middle,
	});
};

module.exports = Router;
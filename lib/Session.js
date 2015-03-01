// var sessions = {};
var fs = require('fs');
var memcache = require('memcache');
var memcacheConfig = JSON.parse(fs.readFileSync('./configs/memcache.json'));

var connection = new memcache.Client(memcacheConfig.port, memcacheConfig.host);
connection.connect();

var emptyFn = function() {};

var Session = module.exports = {
	sessions : {},
	set : function(value, expire, options) {
		var self = this;
		options = options || {};
		expire = expire || 8 * 60 * 60;

		var date = new Date().getTime().toString();
		var rand = Math.random().toString().substr(2);
		var session = md5(date + rand);

		connection.set(session, value, expire);
		// this.sessions[session] = value;
		// setTimeout(function() {
		// 	self.clear(session);
		// }, expire * 1000);
		
		return session;
	},

	get : function(session, next) {
		next = typeof(next) == 'function' ? next : emptyFn;
		// if (session) return this.sessions[session];
		// return null;
		if (!session) {
			next(new Error('no Session'));
			return;
		}
		connection.get(session, function(err, res) {
			if (!res) return next(new Error('no Session'));
			next(err, res);
		});
	},

	clear : function(session) {
		if (session) delete this.sessions[session];
		else this.sessions = {};
	},
};

var md5 = function(string, encoding) {
	encoding = encoding || 'hex';
	// var crypto = require('crypto');
	// var md5 = crypto.createHash('md5');
	return require('crypto').createHash('md5').update(string).digest(encoding);
}
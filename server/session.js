// var sessions = {};
var Session = module.exports = {
	sessions : {},
	set : function(value, expire, options) {
		var self = this;
		options = options || {};
		expire = expire || 30 * 60;

		var date = new Date().getTime().toString();
		var rand = Math.random().toString().substr(2);
		var session = md5(date + rand);
		// console.log(date, rand, session);
		this.sessions[session] = value;
		setTimeout(function() {
			self.clear(session);
		}, expire * 1000);
		
		return session;
	},

	get : function(session) {
		if (session) return this.sessions[session];
		return null;
		// return this.sessions;
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
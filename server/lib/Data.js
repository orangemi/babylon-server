var Then = require('thenjs');
var mysql = require('mysql');
var fs = require('fs');

var extend = require('./extend.js');

var mysqlConfig = JSON.parse(fs.readFileSync('./configs/mysql.json'));
var connection = mysql.createConnection(mysqlConfig);

var Data = module.exports = function() {
	this.init();
};

Data.query = connection.query.bind(connection);

Data.prototype.init = function() {

	this.protoData = {};
	var Class = this.constructor;
	for (var key in Class.columns) {
		this[key] = Class.columns[key];
	}
};

Data.extend = extend;

Data.load = function(id, next) {
	var self = this;
	var Class = this;

	Then(function(then) {
		Data.query("SELECT * FROM ?? WHERE id=?", [Class.tableName, id], then);
	}).then(function(then, result) {
		var obj = new Class();
		if (result.length) {
			result = result[0];
			for (var key in Class.columns) {
				obj[key] = obj.protoData[key] = result[key];
			}
			next(null, obj);
		} else {
			then('no user');
		}
	}).catch(function(then, error) {
		console.error(error.stack);
		next(error);
	});
};

Data.find = function(obj, next) {
	var self = this;
	var Class = this;

	//TODO
	var post = {};
	for (var key in Class.columns) {
		if (obj[key]) post[key] = obj[key];
	}

	Then(function(then) {
		Data.query("SELECT * FROM ?? WHERE " + addWhereAnd(post), [Class.tableName], then);
	}).then(function(then, rs) {
		var result = [];
		rs.forEach(function(line) {
			var obj = new Class();
			for (var key in Class.columns) {
				obj[key] = obj.protoData[key] = line[key];
			}
			result.push(obj);
		});
		next(null, result);
	}).catch(function(then, error) {
		console.error(error.stack);
		next(error);
	});
};

Data.prototype.save = function(next) {
	var self = this;
	var Class = this.constructor;
	var post = {};
	next = typeof(next) == 'function' ? next : function() {};

	for (var key in Class.columns) {
		if (self[key] && self[key] != self.protoData[key]) post[key] = self[key];
	}

	if (self.id) {
		Data.query("UPDATE ?? SET ?? WHERE id=?", [Class.tableName, post, self.id], function(err, result) {
			if (err) return next(err);
			next(null, self);
		});
	} else {
		Data.query("INSERT INTO ?? SET ?", [Class.tableName, post], function(err, result) {
			if (err) return next(err);
			self.id = result.insertId;
			next(null, self);
		});
	}
};

var addWhereAnd = function(post) {
	var result = ['1=1'];
	for (var key in post) {
		var value = mysql.escape(post[key]);
		result.push("`" + key + "` = " + value + "");
	}
	return result.join(' AND ');
};

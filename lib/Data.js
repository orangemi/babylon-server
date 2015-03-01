var Then = require('thenjs');
var mysql = require('mysql');
var fs = require('fs');

var extend = require('./extend.js');

var mysqlConfig = JSON.parse(fs.readFileSync('./configs/mysql.json'));
var connection = mysql.createConnection(mysqlConfig);

var emptyFn = function() {};

var Data = module.exports = function() {
	this.init();
};

Data.query = function() {
	console.log('SQL:', arguments[0], arguments[1]);
	return connection.query.apply(connection, arguments);
};

Data.prototype.init = function() {
	this.protoData = {};
	var Class = this.constructor;
	for (var key in Class.columns) {
		this[key] = Class.columns[key];
	}
};

Data.prototype.loadObj = function(obj) {
	var Class = this.constructor;
	for (var key in Class.columns) {
		this[key] = this.protoData[key] = obj[key];
	}
};

Data.extend = extend;

Data.load = function(id, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	var self = this;
	var Class = this;

	Then(function(then) {
		Data.query("SELECT * FROM ?? WHERE id=?", [Class.tableName, id], then);
	}).then(function(then, rows) {
		var obj = new Class();
		if (!rows.length) throw new Error('no data id=' + id);
		var row = rows[0];
		obj.loadObj(row);
		next(null, obj);
	});
};

Data.find = function(obj, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	var self = this;
	var Class = this;

	//TODO
	var whereAnd = addWhereAnd2(obj, Class.columns, options);
	// var post = {};
	// for (var key in obj) {
	// 	var 
	// } 

	// for (var key in Class.columns) {
	// 	if (obj[key]) post[key] = obj[key];
	// }

	Then(function(then) {
		Data.query("SELECT * FROM ?? WHERE " + whereAnd, [Class.tableName], then);
		// Data.query("SELECT * FROM ?? WHERE " + addWhereAnd(post), [Class.tableName], then);
	}).then(function(then, rows) {
		var result = [];
		rows.forEach(function(row) {
			var obj = new Class();
			obj.loadObj(row);
			result.push(obj);
		});
		next(null, result);
	});
};

Data.prototype.save = function(next) {
	var self = this;
	var Class = this.constructor;
	var post = {};
	var count = 0;
	next = typeof(next) == 'function' ? next : function() {};

	for (var key in Class.columns) {
		if (self[key] !== null && self[key] != self.protoData[key]) {
			post[key] = self[key];
			count++;
		}
	}

	if (!count) {
		//no need to update
		next(null, self);
		return;
	}

	if (self.id) {
		Data.query("UPDATE ?? SET ? WHERE id=?", [Class.tableName, post, self.id], function(err, result) {
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

Data.prototype.display = function() {
	var Class = this.constructor;
	var result = {};
	for (var key in Class.columns) {
		result[key] = this[key];
	}
	return result;
};

var addWhereAnd = function(post) {
	var result = ['1=1'];
	for (var key in post) {
		var value = mysql.escape(post[key]);
		result.push("`" + key + "` = " + value + "");
	}
	return result.join(' AND ');
};

var addWhereAnd2 = function(obj, columns, options) {
	var result = ['1=1'];
	for (var key in obj) {
		var index = key.indexOf(' ');
		index = index > 0 ? index : key.length;
		var name = key.substr(0, index);
		var operation = key.substr(index + 1) || '=';
		var value = mysql.escape(obj[key]);
// console.log(name, operation, value, index, key);

		if (columns[name] === undefined) continue;
		result.push(["`" ,name ,"` ", operation, " ", value, ""].join(''));
	}
	return result.join(' AND ');
};

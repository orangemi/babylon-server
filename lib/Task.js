var Then = require('thenjs');
var Data = require('./Data');
var Person = require('./Person');

var emptyFn = function() {};

var Task = module.exports = Data.extend({
});

Task.findByPerson = function(person, next) {
	if (!(person instanceof Person)) throw new Error('person is not a Person');
	var sql = "SELECT * FROM task WHERE assign = ? ORDER BY sort ASC, complete ASC";
	Data.query(sql, [person.id], function(err, rows) {
		var tasks = [];
		rows.forEach(function(row) {
			var task = new Task();
			task.loadObj(row);
			tasks.push(task);
		});
		next(null, tasks);
	});
};

Task.findByTask = function(task, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	if (!(task instanceof Task)) throw new Error('task is not a Task');

	var sql1 = "SELECT task.* FROM task2task LEFT JOIN task ON task.id = task2task.task_id WHERE task2task.parent_id=? AND task.id IS NOT NULL ORDER BY sort ASC";
	var sql2 = "SELECT task.* FROM task2task LEFT JOIN task ON task.id = task2task.parent_id WHERE task2task.task_id=? AND task.id IS NOT NULL ORDER BY sort ASC";
	var sql;
	switch (options.type) {
		case 'sub':		sql = sql1; break;
		case 'parent':	sql = sql2; break;
		default: 		throw "Unknown Task Type";
	}
	Data.query(sql, [task.id], function(err, rows) {
		var tasks = [];
		rows.forEach(function(row) {
			var task = new Task();
			task.loadObj(row);
			tasks.push(task);
		});
		next(null, tasks);
	});
};

Task.prototype.assignToTask = function(task, sort, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	if (!this.id) throw new Error('no task id');
	if (!(task instanceof Task)) throw new Error('task is not a Task');
	var self = this;
	sort = sort || 1;
	Then(function(then) {
		//DELETE sort
		var sql = "DELETE FROM task2task WHERE task_id = ? AND parent_id = ? ";
		Data.query(sql, [self.id, task.id], then);
	}).then(function(then, result) {
		if (!result.changedRows) return then();
		var sql = "UPDATE task2task SET sort = sort - 1 WHERE parent_id = ? AND sort > ?";
		Data.query(sql, [task.id, sort, self.id], then);
	}).then(function(then) {
		if (options.del) return next(null, self);

		//UPDATE insert
		var post = {
			sort: sort,
			task_id: self.id,
			parent_id: task.id,
		};
		var sql = "INSERT INTO task2task SET ?";
		Data.query(sql, [post], then);
	}).then(function(then) {
		//UPDATE sort
		var sql = "UPDATE task2task SET sort = sort + 1 WHERE parent_id = ? AND sort > ?";
		Data.query(sql, [task.id, sort], then);
	}).finally(function() {
		next(null ,self);
	});

};

Task.prototype.assignToPerson = function(person, sort, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	if (!this.id) throw new Error('no task id');
	if (person && !(person instanceof Person)) throw new Error('person is not a Person');
	var self = this;
	var assign = person ? person.id : 0;
	sort = sort || 1;

	Then(function(then) {
		if (!self.assign) return then();
		var sql = "UPDATE task SET sort = sort - 1 WHERE assign = ? AND sort > ?";
		Data.query(sql, [self.assign, self.sort], then);
	}).then(function(then) {
		var sql = "UPDATE task SET assign = ?, sort = ? WHERE id = ?";
		Data.query(sql, [assign, sort, self.id], then);
	}).then(function(then) {
		if (!assign) return next(null, self);
		//UPDATE sort
		var sql = "UPDATE task SET sort = sort + 1 WHERE assign = ? AND sort > ?";
		Data.query(sql, [assign, sort], then);
	}).finally(function() {
		self.assign = person.id;
		self.sort = sort;
		next(null ,self);
	});
};

Task.TYPE = {
	PROJECT : 1,
	TASK : 2,
};

Task.STATUS = {
	NORMAL : 1,
	DESTROY : 2,
};

Task.COMPLETE = {
	INCOMPLETE : 1,
	COMPLETE : 2,
};

Task.tableName = 'task';
Task.columns = {
	id : 0,
	organization_id : 0,
	type : Task.TYPE.PROJECT,
	status : Task.STATUS.NORMAL,
	title : '',
	description : '',
	complete : Task.COMPLETE.COMPLETE,
	creator : 0,
	assign : 0,
	sort : 0,
	scheduletime : 0,
	createtime : 0,
	updatetime : 0,
};

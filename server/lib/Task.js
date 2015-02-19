var Then = require('thenjs');
var Data = require('./Data');
var Person = require('./Person');
// var Task2Task = require('./Task2Task');

var Task = module.exports = Data.extend({
});

Task.findByPerson = function(person, next) {
	if (!(person instanceof Person)) throw new Error('person is not a Person');
	var sql = "SELECT task.* FROM person2task LEFT JOIN task ON task.id = person2task.task_id WHERE person2task.person_id=? AND task.id IS NOT NULL ORDER BY sort ASC";
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

Task.prototype.assignTo = function(person, sort, next) {
	if (!this.id) throw new Error('no task id');
	var self = this;
	sort = sort || 1;

	Then(function(then) {
		//DELETE sort
		var sql = "DELETE FROM person2task WHERE task_id=?";
		Data.query(sql, [self.id], then);
	}).then(function(then) {
		//UPDATE insert
		var post = {
			sort: sort,
			task_id: self.id,
			person_id: person.id,
		};
		var sql = "INSERT INTO person2task SET ?";
		Data.query(sql, [post], then);
	}).then(function(then, result) {
		//UPDATE sort
		var sql = "UPDATE person2task SET sort=sort+1 WHERE sort >= ? AND task_id <> ?";
		Data.query(sql, [sort, self.id], then);
	}).finally(function() {
		if (typeof(next) == 'function') next(null ,self);
	})
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
	scheduletime : 0,
	createtime : 0,
	updatetime : 0,
};

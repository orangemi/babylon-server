var Then = require('thenjs');
var Data = require('./Data');

var Task2Task = module.exports = Data.extend({});

Task2Task.tableName = 'task2task';
Task2Task.columns = {
	id : 0,
	task_id : 0,
	parent_id : 0,
	sort : 1,
};


// var Then = require('thenjs');
var Data = require('./Data');

var Task = module.exports = Data.extend({
});

Task.STATUS = {
	NORMAL : 1,
	FREEZE : 2,
};

Task.tableName = 'task';
Task.columns = {
	id : null,
	status : Task.STATUS.NORMAL,
	name : '',
	email : '',
	password : '',
	description : '',
	createtime : '',
	updatetime : '',
};

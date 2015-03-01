// var Then = require('thenjs');
var Data = require('./Data');

var Person = module.exports = Data.extend({
});

Person.STATUS = {
	NORMAL : 1,
	FREEZE : 2,
};

Person.tableName = 'person';
Person.columns = {
	id : 0,
	status : Person.STATUS.NORMAL,
	name : '',
	email : '',
	password : '',
	description : '',
	createtime : 0,
	updatetime : 0,
	main_task_id : 0,
};

// var Then = require('thenjs');
var Data = require('./Data');

var User = module.exports = Data.extend({
});

User.STATUS = {
	NORMAL : 1,
	FREEZE : 2,
};

User.tableName = 'user';
User.columns = {
	id : 0,
	status : User.STATUS.NORMAL,
	name : '',
	email : '',
	password : '',
	description : '',
	createtime : 0,
	updatetime : 0,
	main_task_id : 0,
};

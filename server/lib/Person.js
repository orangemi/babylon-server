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
	id : null,
	status : Person.STATUS.NORMAL,
	name : '',
	email : '',
	password : '',
	description : '',
	createtime : '',
	updatetime : '',
};

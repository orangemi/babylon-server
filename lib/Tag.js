var Then = require('thenjs');
var Data = require('./Data');
// var User = require('./User');
// var Task = require('./Task');

var emptyFn = function() {};

var Tag = module.exports = Data.extend({
});

Tag.STATUS = {
	NORMAL : 1,
	DESTROY : 2,
};

Tag.tableName = 'tag';
Tag.columns = {
	id : 0,
	status : Tag.STATUS.NORMAL,
	organization_id : 0,
	name : '',
	task_id : 0,
	createtime : 0,
	updatetime : 0,
};

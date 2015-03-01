var Then = require('thenjs');
var Data = require('./Data');
var Person = require('./Person');
var Task = require('./Task');
// var Task2Task = require('./Task2Task');

var History = module.exports = Data.extend({
});

History.prototype.loadObj = function(obj) {
	Data.prototype.loadObj.apply(this, arguments);
	try {
		var content = JSON.parse(this.content);
		for (var key in History.contentColumns)
			this[key] = content[key];
	} catch (e) { }
};

History.prototype.save = function(next) {
	var post = {};
	for (var key in History.contentColumns) {
		post[key] = this[key];
	}
	this.content = JSON.stringify(post);
	return Data.prototype.save.apply(this, arguments);
};

History.prototype.display = function() {
	var result = Data.prototype.display.apply(this, arguments);
	delete result.content;
	switch (this.type) {
		case History.TYPE.COMMENT:
			result.message = this.message;
			break;
	}
	return result;
};

History.TYPE = {
	UNKNOWN : 0,
	COMMENT : 1,
	CHANGE_TITLE : 2,
	CHANGE_DESC : 3,
	COMMIT_CODE : 4,
};

History.STATUS = {
	NORMAL : 1,
	DESTROY : 2,
};

History.tableName = 'history';
History.columns = {
	id : 0,
	task_id : 0,
	type : 0,
	status : History.STATUS.NORMAL,
	content : '{}',
	creator : 0,
	createtime : 0,
	updatetime : 0,
};

History.contentColumns = {
	message: '',
	commit: '',
};

// var Then = require('thenjs');
var Data = require('./Data');
var User = require('./User');

var emptyFn = function() {};

var Organization = module.exports = Data.extend({
});

Organization.findByUser = function(user, options, next) {
	if (typeof(options) == 'function') {
		next = options;
		options = {};
	}

	options = options || {};
	next = typeof(next) == 'function' ? next : emptyFn;

	if (!(user instanceof User)) throw new Error('user is not a User');

	var sql = "SELECT organization.* FROM user2organization LEFT JOIN organization ON organization.id = user2organization.organization_id WHERE user2organization.user_id = ? AND organization.id IS NOT NULL ORDER BY sort ASC";
	Data.query(sql, [user.id], function(err, rows) {
		if (err) return next(err)
		var result = [];
		rows.forEach(function(row) {
			var target = new Organization();
			target.loadObj(row);
			result.push(target);
		});
		next(null, result);
	});
};

Organization.STATUS = {
	NORMAL : 1,
	FREEZE : 2,
};

Organization.tableName = 'organization';
Organization.columns = {
	id : 0,
	name : '',
	status : Organization.STATUS.NORMAL,
	owner : '',
	creator : '',
	createtime : 0,
	updatetime : 0,
};

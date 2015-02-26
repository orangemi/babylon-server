define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils'],
function (Backbone, _, $, app, Utils) {

	var Model = Backbone.Model.extend({

		save : function(options, next) {
			options = options || {};
			var id = this.id || '';
			var post = options.empty ? {} : this.getJSON();
			Utils.post('task/' + id, post, function(rep) {
				if (rep.id) this.id = rep.id;
				if (typeof(next) == 'function') next(rep);
			});
		},

		sync : function() {

		},

		assignTo : function(person, next) {
			if (!this.id) throw 'Task can not be assign without id.';
		},

		parentTo: function(task, sort, next) {
			if (!this.id) throw 'Task can not be parent without id.';
			var uri = ['task', this.id, 'parent'].join('/');
			var post = {
				parent: task.id,
				sort: sort,
			};
			Utils.post(uri, post, next);
		},

		getJSON : function() {
			return $.extend({}, this.attributes);
		},

	});

	return Model;
});
define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils'],
function (Backbone, _, $, app, Utils) {

	var Model = Backbone.Model.extend({

		save : function(options, next) {
			var self = this;
			options = options || {};
			var id = this.get('id') || '';
			var post = this.getJSON();

			if (!id || this.hasChanged()) {
				Utils.post('task/' + id, post, function(rep) {
					self.changed = {};
					if (rep.id) self.set('id', rep.id);
					if (typeof(next) == 'function') next(rep);
					self.trigger('saved', self);
				});
			} else {
				if (typeof(next) == 'function') next(null);
			}

			self.trigger('save', self);
		},



		sync : function() {

		},

		assignTo : function(type, target, next) {
			var self = this;
			if (!this.get('id')) throw 'Task can not be assign without id.';
			var uri = ['task', this.id, 'assign'].join('/');
			var post = {
				target: target,
				type: type,
				sort: this.get('sort'),
			};
			Utils.post(uri, post, function() {
				if (typeof(next) == 'function') next(self);
				self.trigger('assigned', self, type, target);
			});
		},

		// parentTo: function(task, sort, next) {
		// 	if (!this.id) throw 'Task can not be parent without id.';
			
		// },

		getJSON : function() {
			return $.extend({}, this.attributes);
		},

	});

	return Model;
});
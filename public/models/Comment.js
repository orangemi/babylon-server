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

		getJSON : function() {
			return $.extend({}, this.attributes);
		},

	});

	return Model;
});
define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils'],
function (Backbone, _, $, app, Utils) {

	var Model = Backbone.Model.extend({

		fetchMe : function(options, next) {
			if (typeof(options) == 'function') {
				next = options;
				options = {};
			}
			next = typeof(next) == 'function' ? next : Utils.emptyFn;
			options = options || {};
			var self = this;
			var uri = ['my'].join('/');
			Utils.get(uri, {}, function(rep) {
				self.set(rep);
				next(self);
			});

		},

		save : function(options, next) {

		},
		
		sync : function() {

		},

		getJSON : function() {
			return $.extend({}, this.attributes);
		},

	});

	return Model;
});
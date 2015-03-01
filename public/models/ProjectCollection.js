define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils'],
function (Backbone, _, $, app, Utils) {

	var emptyFn = function() {};

	var Collection = Backbone.Collection.extend({
		// model : null,

		fetch : function(id, callback) {
			if (typeof(id) == 'function') {
				id = null;
				callback = id;
			}

			callback = typeof(callback) == 'function' ? callback : emptyFn;
			this.remove(this.models);

			var self = this;
			var uri = ['task', id, 'parent'].join('/');
			Utils.get(uri, {}, function(rep) {
				self.add(rep);
			});
		},
	});

	return Collection;
});
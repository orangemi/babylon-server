define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils', 'models/Task'],
function (Backbone, _, $, app, Utils, Task) {

	var emptyFn = function() {};

	var Collection = Backbone.Collection.extend({
		model : Task,

		fetch : function(type, callback) {
			callback = typeof(callback) == 'function' ? callback : emptyFn;

			console.log('before remove:', this.length);
			this.remove(this.models);
			console.log('after  remove:', this.length);

			if (type == 'my') return this.fetchMy(callback);
		},

		fetchMy : function(callback) {
			var self = this;
			Utils.get('my/task', {}, function(rep) {
				self.add(rep);
			});
		},

	});

	return Collection;
});
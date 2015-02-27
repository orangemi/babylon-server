define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils', 'models/Task'],
function (Backbone, _, $, app, Utils, Task) {

	var emptyFn = function() {};

	var Collection = Backbone.Collection.extend({
		model : Task,
		assignType : null,
		assignTo : null,

		fetch : function(type, id, callback) {
			if (typeof(id) == 'function') {
				id = null;
				callback = id;
			}

			callback = typeof(callback) == 'function' ? callback : emptyFn;

			console.log('before remove:', this.length);
			this.remove(this.models);
			console.log('after  remove:', this.length);

			switch (type) {
				case 'my': return this.fetchMy(callback);	
				case 'sub': return this.fetchSub(id, callback);	
				case 'person': return this.fetchPerson(id, callback);
			}
		},

		fetchSub : function(id, callback) {
			var self = this;
			var uri = ['task', id, 'sub'].join('/');
			Utils.get(uri, {}, function(rep) {
				self.assignType = 'task';
				self.assignTo = id;
				rep.forEach(function(task) {
					self.add(task);
				})
				// self.add(rep);
			});
		},

		fetchMy : function(callback) {
			var self = this;
			Utils.get('my/task', {}, function(rep) {
				self.assignType = 'my';
				self.assignTo = 0;
				rep.forEach(function(task) {
					self.add(task);
				})
			});
		},
	});

	return Collection;
});
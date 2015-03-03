define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils', 'models/Task'],
function (Backbone, _, $, app, Utils, Task) {

	var emptyFn = function() {};

	var Collection = Backbone.Collection.extend({
		model : Task,
		assignType : null,
		assignTo : null,

		search : function(word, options, callback) {
			callback = typeof(callback) == 'function' ? callback : emptyFn;
			var uri = ['search'].join('/');
			var post = {
				types: ['task'],
				organization_id: null,
				word: word,
			};
			Utils.post(uri, post, function(rep) {
				callback(rep);
			});
		},

		fetch : function(type, id, callback) {
			if (typeof(id) == 'function') {
				id = null;
				callback = id;
			}

			callback = typeof(callback) == 'function' ? callback : emptyFn;
			this.remove(this.models);

			switch (type) {
				case 'my': return this.fetchMy(callback);	
				case 'sub': return this.fetchSub(id, callback);	
				case 'parent': return this.fetchParent(id, callback);	
				case 'person': return this.fetchPerson(id, callback);
			}
		},

		fetchParent : function(id, callback) {
			var self = this;
			var uri = ['task', id, 'parent'].join('/');
			Utils.get(uri, {}, function(rep) {
				// self.assignType = 'task';
				// self.assignTo = id;
				rep.forEach(function(task) {
					self.add(task);
				})
				// self.add(rep);
			});
		},

		fetchSub : function(id, callback) {
			var self = this;
			var uri = ['task', id, 'sub'].join('/');
			Utils.get(uri, {}, function(rep) {
				// self.assignType = 'task';
				// self.assignTo = id;
				rep.forEach(function(task) {
					self.add(task);
				})
				// self.add(rep);
			});
		},

		fetchMy : function(callback) {
			var self = this;
			var uri = ['my', 'task'].join('/');
			Utils.get(uri, {}, function(rep) {
				// self.assignType = 'my';
				// self.assignTo = 0;
				rep.forEach(function(task) {
					self.add(task);
				})
				// self.add(rep);
			});
		},
	});

	return Collection;
});
define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils', 'models/Task'],
function (Backbone, _, $, app, Utils, Task) {

	var Collection = Backbone.Collection.extend({
		model : Task,
		assignType : null,
		assignTo : null,

		// fetchByModel : function(model) {
			// if (model)
		// },

		fetch : function(type, id, callback) {
			if (typeof(id) == 'function') {
				id = null;
				callback = id;
			}

			callback = typeof(callback) == 'function' ? callback : Utils.emptyFn;
			this.remove(this.models);

			switch (type) {
				case 'my': return this.fetchUser(app.me.id, callback);	
				case 'sub': return this.fetchSub(id, callback);	
				case 'parent': return this.fetchParent(id, callback);	
				case 'user': return this.fetchUser(id, callback);
			}
		},

		fetchParent : function(id, callback) {
			var self = this;
			var uri = [app.organization.id, 'task', id, 'parent'].join('/');
			Utils.get(uri, {}, function(rep) {
				// self.assignType = 'task';
				// self.assignTo = id;
				rep.forEach(function(task) {
					self.add(task);
				});
				// self.add(rep);
			});
		},

		fetchSub : function(id, callback) {
			var self = this;
			var uri = [app.organization.id, 'task', id, 'sub'].join('/');
			Utils.get(uri, {}, function(rep) {
				self.assignType = 'task';
				self.assignTo = id;
				rep.forEach(function(task) {
					self.add(task);
				});
				// self.add(rep);
			});
		},

		// fetchMy : function(me, callback) {
		// 	var self = this;
		// 	var uri = [app.organization.id, 'mytask'].join('/');
		// 	Utils.get(uri, {}, function(rep) {
		// 		self.assignType = 'my';
		// 		self.assignTo = 0;
		// 		rep.forEach(function(task) {
		// 			self.add(task);
		// 		});
		// 		// self.add(rep);
		// 	});
		// },


		fetchUser : function(id, callback) {
			var self = this;
			var uri = [app.organization.id, 'user', id, 'task'].join('/');
			Utils.get(uri, {}, function(rep) {
				self.assignType = 'user';
				self.assignTo = 0;
				rep.forEach(function(task) {
					self.add(task);
				});
				// self.add(rep);
			});
		},
	});

	Collection.search = function(word, options, callback) {
		callback = typeof(callback) == 'function' ? callback : Utils.emptyFn;
		var uri = [app.organization.id, 'search'].join('/');
		var post = {
			types: ['task'],
			organization_id: null,
			word: word,
		};
		Utils.post(uri, post, function(rep) {
			callback(rep.task);
		});
	};

	return Collection;
});
define([
	'backbone',
	'underscore',
	'views/Dialog',
	'views/Home',
	'app/models',
],
function (Backbone, _, DialogView, HomeView, Models) {
	var Router = Backbone.Router.extend({
		app : null,
		history : null,
		routes : {
			''					: 'goHome',
			'home'				: 'goHome',
			'login'				: 'goLogin',
			'task/:id'			: 'goTask',
			'*notFound'			: 'goNotFound',
		},

		initialize : function(app) {
			var self = this;
			this.app = app;
			this.history = [];

			// this.listen(this, 'all', this.)

			//TODO code should be re'managed.
			//define some useful function
			app.showDialog = function(options) {
				var view = new DialogView(options);
				//app.view,(view);
				app.view.showPop(view);
				return view;
			};

			//TODO code should be re'managed.
			app.showMenu = function(view, x, y) {
				app.view.$el.append(view.render().$el);
				view.setPosition(x - app.view.$el.offset().left, y - app.view.$el.offset().top);
			};

		},

		render : function() {
			if (this.app.view) return this.app.view;
			var view = this.app.view = new HomeView();
			return view.render();
		},

		goHome : function() {
			var self = this;
			this.render().bodyRegion.reset();
		},

		goTask : function(id, model) {
			var self = this;
			var view;
			require(['views/TaskDetail','views/UserTaskDetail'], function(TaskDetailView, UserTaskDetailView) {
				if (model.type == 'task')
					view = new TaskDetailView({model: model});
				else if (model.type == 'user')
					view = new UserTaskDetailView({model: model});
				self.app.view.detailRegion.show(view);
			});
		},

		goLogin : function() {
			var self = this;
			require(['views/Login'], function(LoginView) {
				var loginView = new LoginView();
				self.render().bodyRegion.show(loginView);
			});
		},

		goNotFound : function() {
			console.error('page not found');
			// this.goHome();
		},
		
	});
	return Router;
});
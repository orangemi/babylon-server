define([
'marionette', 'underscore', 'app/app', 'text!html/Home.html', 'views/Menu', 'views/TaskList', 'models/Task', 'models/User'],
function (Marionette, _, app, Html, MenuView, TaskList, TaskModel, User) {
	var HomeView = Marionette.Layout.extend({
		id : 'home',
		className : 'flex home',
		template : _.template(Html),

		regions : {
			"topRegion" : ">.top",
			"leftRegion" : ">.left",
			"bodyRegion" : ">.body",
			"bottomRegion" : ">.bottom",
			"detailRegion" : ">.content>.detail",
			"popRegion" : ">.popup",
		},

		events : {
			'click .view-type' : 'onViewTypeClick',
		},

		initialize : function() {
			var self = this;
			var me = app.me = new User();
		},

		onRender : function() {
			var self = this;

			app.me.fetchMe(function() {
				app.organization = app.me.getOrganization();
				self.onViewChange('MyTask');
			});
		},

		onViewTypeClick : function(evt) {
			var self = this;
			var $dom = $(evt.currentTarget);
			var menuView = new MenuView({menus : [
				{ type: 'button', value: 'MyTask', text: 'My Task', },
				{ type: 'button', value: 'MyProject', text: 'My Project', },
			]});

			menuView.show();
			menuView.setPosition($dom.offset().left, $dom.offset().top + $dom.height());
			// this.listenTo(menuView, 'menu:ButtonClick', this.onViewChange);
			menuView.on('menu:ButtonClick', function(buttonView) {
				self.onViewChange(buttonView.model.get('value'), buttonView.model.get('text'));
			});

		},

		onViewChange : function(projectId, viewName) {
			console.log(projectId);
			if (projectId == 'MyTask');
				app.router.goTask('', app.me);
			// this.taskList.collection.fetch('my');
		},

		showPop : function(view) {
			this.popRegion.show(view);
			var pops = this.$el.find('>.popup').removeClass('hide');
			view.on('close', function() {
				if (pops.length == 1) pops.addClass('hide');
			});
		}
	});

	return HomeView;
});
define([
'marionette', 'underscore', 'app/app', 'text!html/Home.html', 'views/Menu', 'views/TaskList', 'models/Task'],
function (Marionette, _, app, Html, MenuView, TaskList, TaskModel) {
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
			var taskList = this.taskList = new TaskList();
		},

		onRender : function() {
			this.taskList.render().$el.appendTo(this.$el.find('.content .list .tasks'));

			//TODO add a sample
			// this.taskList.collection.add({});

			this.onViewChange('MyTask');

			// var task = new TaskModel();
			// task.save();
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
			this.taskList.collection.fetch('my');
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
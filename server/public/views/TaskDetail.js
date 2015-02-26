define([
'marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskList', 'models/Task'],
function (Marionette, _, app, Html, MenuView, TaskListView, TaskModel) {
	var View = Marionette.Layout.extend({
		className : 'task-detail',
		template : _.template(Html),

		onRender : function() {
			this.$el.find('.title-panel .title').val(this.model.get('title'));
			this.$el.find('.description-panel .description').html(this.model.get('description'));
			this.getSubTasks();
		},

		getSubTasks : function() {
			var id = this.model.get('id');
			this.taskListView = this.taskListView || new TaskListView();
			this.taskListView.render().$el.appendTo(this.$el.find('>.sub-tasks-panel'));
			this.taskListView.collection.fetch('sub', id);
		}
	});

	return View;
});

	
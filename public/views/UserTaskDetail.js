define(['marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskDetail', 'models/Utils'],
function (Marionette, _, app, Html, MenuView, TaskDetailView, Utils) {
	var View = TaskDetailView.extend({
		className : 'task-detail user-task',

		onChange : function() {
			var title = this.model.get('name') + '\'s Task';
			this.$el.find('.title-panel .title').val(title).attr('disabled', 'disabled');
			this.$el.find('.description-panel .description').html('').attr('disabled', 'disabled').addClass('hide');
		},

		onRender : function() {
			TaskDetailView.prototype.onRender.apply(this, arguments);

			var $el = this.$el;
			$el.children('.project-panel').addClass('hide');
			$el.children('.tag-panel').addClass('hide');
			$el.children('.description-panel').addClass('hide');
			$el.children('.comment-panel').addClass('hide');
			$el.children('.assignee-panel').addClass('hide');
		},

		getSubTasks : function() {
			var id = this.model.id;
			this.taskListView.collection.fetch('user', id);
		},

		getProjects : function() {},
		getComments : function() {},
		getTags : function() {},
		getAsignee : function() {},


	});

	return View;
});

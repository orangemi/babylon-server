define([
'marionette', 'underscore', 'app/app', 'views/TaskLine', 'models/TaskCollection'],
function (Marionette, _, app, TaskLineView, TaskCollection) {
	var View = Marionette.Layout.extend({
		tagName : 'ul',
		className : 'task-list',
		template : _.template(''),

		initialize : function(options) {
			options = options || {};
			var collection = this.collection = options.collection || new TaskCollection();
			this.listenTo(collection, 'add', this.onAddTask);
			this.listenTo(collection, 'remove', this.onRemoveTask);
		},

		onAddTask : function(task, options) {
			options = options || {};
			var taskLine = new TaskLineView({model: task});
			var $el = taskLine.render().$el.appendTo(this.$el);
			this.listenTo(taskLine, 'addTask', this.onAddTask);

			//TODO addTask at certain index (options.sort or task.sort).

			if (options.focus) {
				setTimeout(function() {
					taskLine.focus();
				});
			}

			// this.listenTo(taskLine, 'addTask', this.onAddTask);
		},

		onRemoveTask : function(task, options) {

		},

	});
	return View;
});

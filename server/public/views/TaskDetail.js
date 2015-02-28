define([
'marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskList', 'views/TagLine', 'models/Task'],
function (Marionette, _, app, Html, MenuView, TaskListView, TagLineView, Task) {
	var View = Marionette.Layout.extend({
		className : 'task-detail',
		template : _.template(Html),

		events: {
			'blur .title' : 'onTitleBlur',
			'blur .description' : 'onDescriptionBlur',
		},

		initialize: function(options) {
			options || options || {};
			this.model = options.model || new Task();
			this.listenTo(this.model, 'change', this.onChange);
			this.listenTo(this.model, 'remove', this.onRemove);
		},

		onRemove :function() {
			this.remove();
		},

		onChange : function() {
			this.$el.find('.title-panel .title').val(this.model.get('title'));
			this.$el.find('.description-panel .description').html(this.model.get('description'));
		},

		onTitleBlur : function() {
			this.model.set('title', this.$el.find('.title-panel .title').val());
			this.model.save();
		},

		onDescriptionBlur : function() {
			this.model.set('description', this.$el.find('.description-panel .description').val());
			this.model.save();
		},

		onRender : function() {
			this.onChange();
			this.getSubTasks();
			this.getTags();
		},

		getTags : function() {
			var $el = this.$el;
			
			//TEST: add sample tags
			for (var i = 0; i < 2; i++) {
				var tag = new TagLineView();
				tag.render().$el.insertBefore($el.find('.tag-panel .tag-input'));				
			}
		},

		getSubTasks : function() {
			var id = this.model.get('id');
			this.taskListView = this.taskListView || new TaskListView();
			this.taskListView.render().$el.appendTo(this.$el.find('>.sub-tasks-panel'));
			this.taskListView.collection.fetch('sub', id);
		},
	});

	return View;
});

	
define([
'marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskList', 'views/CommentLine',  'views/TagLine', 'views/ProjectLine', 'models/Task', 'models/CommentCollection', 'models/TaskCollection', 'models/Utils'],
function (Marionette, _, app, Html, MenuView, TaskListView, CommentLineView, TagLineView, ProjectLineView, Task, CommentCollection, TaskCollection, Utils) {
	var View = Marionette.Layout.extend({
		className : 'task-detail',
		template : _.template(Html),

		events: {
			'blur .title' : 'onTitleBlur',
			'blur .description' : 'onDescriptionBlur',
			'click .comment-btn' : 'onCommentClick',
		},

		initialize: function(options) {
			options || options || {};
			this.model = options.model || new Task();
			this.listenTo(this.model, 'change', this.onChange);
			this.listenTo(this.model, 'remove', this.onRemove);

			this.commentCollection = new CommentCollection();
			this.listenTo(this.commentCollection, 'add', this.onAddComment);
			this.projectCollection = new TaskCollection();
			this.listenTo(this.projectCollection, 'add', this.onAddProject);
		},

		onRemove :function() {
			this.remove();
		},

		onChange : function() {
			this.$el.find('.title-panel .title').val(this.model.get('title'));
			this.$el.find('.description-panel .description').html(this.model.get('description'));
		},

		onCommentClick : function() {
			var self = this;
			var $el = this.$el.find('.comment-input');
			var uri = ['task', this.model.get('id'), 'comment'].join('/');
			var post = {
				message : $el.val(),
			};

			Utils.post(uri, post, function(res) {
				self.commentCollection.add(res);
			});
		},

		onTitleBlur : function() {
			this.model.set('title', this.$el.find('.title-panel .title').val());
			this.model.save();
		},

		onDescriptionBlur : function() {
			this.model.set('description', this.$el.find('.description-panel .description').val());
			this.model.save();
		},

		onAddComment : function(comment) {
			var $el = this.$el;
			var view = new CommentLineView({ model: comment });
			view.render().$el.prependTo($el.find('.comment-list'));
		},

		onAddProject : function(project) {
			var $el = this.$el;
			var view = new ProjectLineView({ model: project });
			view.render().$el.appendTo($el.find('.project-list'));
		},

		onRender : function() {
			this.onChange();
			this.getSubTasks();
			this.getTags();
			this.getComments();
			this.getProjects();
		},

		getTags : function() {
			var $el = this.$el;

			//TEST: add sample tags
			for (var i = 0; i < 2; i++) {
				var tag = new TagLineView();
				tag.render().$el.insertBefore($el.find('.tag-panel .tag-input'));
			}
		},

		getProjects : function() {
			this.projectCollection.fetchParent('parent' ,this.model.get('id'));
			// var $el = this.$el;

			// //TEST: add sample tags
			// for (var i = 0; i < 2; i++) {
			// 	var projectLine = new ProjectLineView();
			// 	projectLine.render().$el.appendTo($el.find('.project-list'));
			// }

		},

		getComments : function() {
			this.commentCollection.fetch(this.model.get('id'));
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

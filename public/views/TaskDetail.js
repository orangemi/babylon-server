define(['marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskList', 'views/CommentLine',  'views/TagLine', 'views/ProjectLine', 'models/Task', 'models/CommentCollection', 'models/TaskCollection', 'models/UserCollection', 'views/AutoComplete', 'models/Utils'],
function (Marionette, _, app, Html, MenuView, TaskListView, CommentLineView, TagLineView, ProjectLineView, Task, CommentCollection, TaskCollection, UserCollection, AutoCompleteView, Utils) {
	var View = Marionette.Layout.extend({
		className : 'task-detail normal-task',
		template : _.template(Html),

		events: {
			'blur .title' : 'onTitleBlur',
			'blur .description' : 'onDescriptionBlur',
			'click .comment-btn' : 'onCommentClick',
			'click .assignee' : 'onAssigneeClick',
		},

		initialize: function(options) {
			options = options || {};
			this.model = options.model || new Task();
			this.listenTo(this.model, 'change', this.onChange);
			this.listenTo(this.model, 'remove', this.onRemove);

			this.commentCollection = new CommentCollection();
			this.listenTo(this.commentCollection, 'add', this.onAddComment);
			this.projectCollection = new TaskCollection();
			this.listenTo(this.projectCollection, 'add', this.onAddProject);

			this.taskListView = new TaskListView();

			//project search
			this.projectAutoCompleteView = new AutoCompleteView();
			this.projectAutoCompleteView.loadCollection = function(pattern, callback) {
				TaskCollection.search(pattern, {}, callback);
			};
			this.projectAutoCompleteView.makeHtml = function(model) {
				return model.get('title');
			};
			this.listenTo(this.projectAutoCompleteView, 'select', this.onSelectProject);

			//assignee search
			this.assigneeAutoCompleteView = new AutoCompleteView();
			this.assigneeAutoCompleteView.loadCollection = function(pattern, callback) {
				UserCollection.search(pattern, {}, callback);
			};
			this.assigneeAutoCompleteView.makeHtml = function(model) {
				return model.get('nick');
			};
			this.listenTo(this.assigneeAutoCompleteView, 'select', this.onAssigneeInputKeyUp);

		},

		onRemove :function() {
			// this.remove();
		},

		onChange : function() {
			this.$el.find('.title-panel .title').val(this.model.get('title'));
			this.$el.find('.description-panel .description').html(this.model.get('description'));
		},

		onAssigneeClick : function() {
			this.$el.find('.assignee-search').removeClass('hide');
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
			this.listenTo(view, 'removeTask', this.onRemoveParentTask);
		},

		onRemoveParentTask : function(task) {
			var self = this;
			this.model.assignTo('task', task.get('id'), { del: true }, function() {
				self.projectCollection.remove(task);
			});
		},

		onRender : function() {
			this.taskListView.render().$el.appendTo(this.$el.find('.sub-tasks-panel'));
			this.projectAutoCompleteView.render().$el.appendTo(this.$el.find('.project-input'));
			this.assigneeAutoCompleteView.render().$el.appendTo(this.$el.find('.assignee-input'));

			this.onChange();
			this.getSubTasks();
			this.getTags();
			this.getComments();
			this.getProjects();
			this.getAssignee();
		},

		onSelectProject : function(task) {
			var self = this;
			this.model.assignTo('task', task.get('id'), function(rep) {
				self.projectCollection.add(task);
			});
		},

		getAssignee : function() {

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
			this.projectCollection.fetch('parent' ,this.model.get('id'));
		},

		getComments : function() {
			this.commentCollection.fetch(this.model.get('id'));
		},

		getSubTasks : function() {
			var id = this.model.get('id');
			this.taskListView.collection.fetch('sub', id);
		},
	});

	return View;
});

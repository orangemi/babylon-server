define([
'marionette', 'underscore', 'app/app', 'text!html/TaskDetail.html', 'views/Menu', 'views/TaskList', 'views/CommentLine',  'views/TagLine', 'models/Task', 'models/CommentCollection', 'models/Utils'],
function (Marionette, _, app, Html, MenuView, TaskListView, CommentLineView, TagLineView, Task, CommentCollection, Utils) {
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

			this.commentsCollection = new CommentCollection();
			this.listenTo(this.commentsCollection, 'add', this.onAddComment);
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
				self.commentsCollection.add(res);
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
			var view = new CommentLineView({ model : comment });
			view.render().$el.prependTo($el.find('.comment-list'));
		},

		onRender : function() {
			this.onChange();
			this.getSubTasks();
			this.getTags();
			this.getComments();
		},

		getTags : function() {
			var $el = this.$el;
			
			//TEST: add sample tags
			for (var i = 0; i < 2; i++) {
				var tag = new TagLineView();
				tag.render().$el.insertBefore($el.find('.tag-panel .tag-input'));				
			}
		},

		getComments : function() {
			this.commentsCollection.fetch(this.model.get('id'));
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

	
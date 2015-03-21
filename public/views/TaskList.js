define([
'marionette', 'underscore', 'app/app', 'text!html/TaskList.html', 'views/TaskLine', 'models/TaskCollection', 'models/Task',],
function (Marionette, _, app, Html, TaskLineView, TaskCollection, Task) {
	var View = Marionette.Layout.extend({
		tagName : 'ul',
		className : 'task-list',
		template : _.template(Html),

		events: {
			'click .actions .add' : 'onAddClick',
		},

		initialize : function(options) {
			options = options || {};
			var collection = this.collection = options.collection || new TaskCollection();
			this.listenTo(collection, 'add', this.onAddTask);
			this.listenTo(collection, 'remove', this.onRemoveTask);
			this.listenTo(app, 'assigned', this.onAssignedTask);
		},

		onRender : function() {

		},

		onAssignedTask : function(task, assignType, assignTo) {
			var localAssignType = this.collection.assignType;
			var localAssignTo = this.collection.assignTo;
			if (this.collection.assignType == 'my') {
				 localAssignType = 'user';
				 localAssignTo = app.me.get('id');
			}
			if (localAssignType != assignType) return;
			if (localAssignTo == assignTo) {
				this.collection.add(task);
			} else {
				this.collection.remove(task);
			}
		},

		onAddClick : function() {
			var self = this;
			var sort = this.collection.length + 1;
			var task = new Task({ sort: sort });
			task.save({}, function() {
				task.assignTo(self.collection.assignType, self.collection.assignTo);
			});
			this.collection.add(task, { focus: true });
		},

		onEnterPress : function(newTask, oldTask, options) {
			options = _.extend({
				at: newTask.get('sort') - 1,
			}, options, {
				focus : true,
			});
			this.collection.add(newTask, options);
			// oldTask.assignTo(this.collection.assignType, this.collection.assignTo);
		},

		onRemoveTask : function(task, collection, options) {
			options = options || {};
			collection.rest(options.index).forEach(function(model) {
				model.set('sort', model.get('sort') - 1);
			});

			if (options.focus) {
				// taskLine.focus();
			}
		},

		onAddTask : function(task, collection, options) {
			options = options || {};
			var taskLine = new TaskLineView({ model: task, assignType: this.collection.assignType, assignTo: this.collection.assignTo, });
			var sort = task.get('sort') || 1;
			var $el = taskLine.render().$el.insertAfter(this.$el.children().eq(sort - 1));
			this.listenTo(taskLine, 'enterPress', this.onEnterPress);
			this.listenTo(task, 'saved', this.onTaskSaved);

			//when insert a row every task after it should add their sort value
			// this.collection.

			collection.rest(sort).forEach(function(model) {
				model.set('sort', model.get('sort') + 1);
			});

			if (options.focus) {
				taskLine.focus();
			}
		},

		onTaskSaved : function(task) {
		},

	});
	return View;
});

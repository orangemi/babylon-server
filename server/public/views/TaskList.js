define([
'marionette', 'underscore', 'app/app', 'text!html/TaskList.html', 'views/TaskLine', 'models/TaskCollection'],
function (Marionette, _, app, Html, TaskLineView, TaskCollection) {
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
		},

		onRender : function() {

		},

		onAddClick : function() {
			var sort = this.collection.length + 1;
			this.collection.add({ sort: sort });
		},

		onEnterPress : function(task, options) {
			options = _.extend({
				at: task.sort - 1,
			}, options, {
				focus : true,
			});
			this.collection.add(task, options);
		},

		onRemoveTask : function(task, collection, options) {
			options = options || {};
			collection.rest(sort).forEach(function(model) {
				model.set('sort', model.get('sort') - 1);
			});

			if (options.focus) {
				// taskLine.focus();
			}
		},

		onAddTask : function(task, collection, options) {
			options = options || {};
			var taskLine = new TaskLineView({ model: task });
			var sort = task.get('sort') || 1;
			var $el = taskLine.render().$el.insertAfter(this.$el.children().eq(sort - 1));
			this.listenTo(taskLine, 'enterPress', this.onEnterPress);

			//when insert a row every task after it should add their sort value
			// this.collection.

			collection.rest(sort).forEach(function(model) {
				model.set('sort', model.get('sort') + 1);
			});

			if (options.focus) {
				taskLine.focus();
			}
		},

		onRemoveTask : function(task, options) {

		},

	});
	return View;
});

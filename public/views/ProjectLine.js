define([
'marionette', 'underscore', 'app/app', 'text!html/ProjectLine.html', 'models/Task'],
function (Marionette, _, app, Html, Task) {
	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'project-line panel',
		template : _.template(Html),

		assignType: null,
		assignTo: null,

		events : {
			'click .remove'	: 'onRemoveClick',
			'click .name'	: 'onNameClick',
		},

		initialize : function(options) {
			this.model = options.model || new Backbone.Model();
			this.listenTo(this.model, 'change', this.onChange);
		},

		onChange : function() {
			this.onRender();
		},

		onRender : function() {
			var $el = this.$el;
			$el.find('.name').html(this.model.get('title'));
		},

		onNameClick : function() {
			app.router.goTask(this.model.get('id'), this.model);
		},

		onRemoveClick : function() {
		},
	});

	return View;
});
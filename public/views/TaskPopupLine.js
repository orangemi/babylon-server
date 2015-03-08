define([
'marionette', 'underscore', 'app/app', 'models/Task'],
function (Marionette, _, app, Task) {
	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'project-popup-line',
		template : _.template(''),

		events : {
			'click'	: 'onClick',
		},

		initialize : function(options) {
			this.model = options.model || new Backbone.Model();
		},

		onChange : function() {
			this.onRender();
		},

		onRender : function() {
			var $el = this.$el;
			$el.html(this.model.get('title'));
		},

		onClick : function() {
			this.trigger('click', this.model.get('id'), this.model.get('title'));
		},
	});

	return View;
});
define([
'marionette', 'underscore', 'app/app', 'text!html/TagLine.html', 'models/Task'],
function (Marionette, _, app, Html, Task) {
	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'tag-line',
		template : _.template(Html),

		events : {
			'click .remove'	: 'onRemoveClick',
		},

		initialize : function(options) {},

		onChange : function() {
			this.onRender();
		},

		onRender : function() {
		},

		onRemoveClick : function() {
		},
	});

	return View;
});
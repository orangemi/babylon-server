define([
'marionette', 'underscore', 'app/app', 'text!html/Dialog.html'],
function (Marionette, _, app, Html) {
	var View = Marionette.Layout.extend({
		className : 'dialog',
		template : _.template(Html),

		events : {
			'click >.top>.close' : 'onButtonCloseClick',
			'click >.bottom>.btn-ok' : 'onButtonOkClick',
			'click >.bottom>.btn-cancel' : 'onButtonCancelClick',
		},

		initialize : function(options) {
			options = options || {};
			this.content = options.content || '';
			this.title = options.title || '';
		},

		onRender : function() {
			this.$el.find('>.content').html(this.content);
			this.$el.find('>.top>.title').html(this.title);
			var $bottom = this.$el.find('>.bottom');
		},

		onButtonCancelClick : function(evt) {
			this.trigger('buttonClick', this);
			this.trigger('buttonClick:Cancel', this);
			this.close();
		},

		onButtonOkClick : function(evt) {
			this.trigger('buttonClick', this);
			this.trigger('buttonClick:OK', this);
			this.close();
		},

		onButtonCloseClick : function(evt) {
			this.close();
		}
	});
	return View;
});
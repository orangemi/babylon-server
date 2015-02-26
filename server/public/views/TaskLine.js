define([
'marionette', 'underscore', 'app/app', 'text!html/TaskLine.html', 'models/Task'],
function (Marionette, _, app, Html, Task) {
	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'task-line flex',
		template : _.template(Html),

		events : {
			'keyup >.title'		: 'onTitleKeyUp',
			'blur >.title'		: 'onBlur',
			'click .go-detail'	: 'onGoDetailClick',
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'change', this.onChange);
		},

		onChange : function() {
			// debugger;
			this.onRender();
		},

		onRender : function() {
			var self = this;
			var $el = this.$el;
			$el.find('.title').val(this.model.get('title') || '');
			$el.find('.sort').html(this.model.get('sort') || '');
			// setTimeout(function() {
			// 	self.$el.find('>.title').focus();
			// })
		},

		onBlur : function() {
			this.model.save();
		},

		onTitleKeyUp : function(evt) {
			if (evt.keyCode == 13) {
				//ENTER
				// evt.preventDefault();
				var sort = this.model.get('sort') + 1;
				this.trigger('enterPress', {sort: sort}, {focus: true});
			}
		},

		onGoDetailClick : function() {
			this.trigger('task-detail', this.model);
			app.router.goTask(this.model.get('id'), this.model);
			//app.router.navigate('task/' + this.model.get('id'));
		},

		focus : function() {
			this.$el.find('>.title').focus();
			return this;
		}
	});

	return View;
});
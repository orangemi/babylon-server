define([
'marionette', 'underscore', 'app/app', 'text!html/TaskLine.html', ],
function (Marionette, _, app, Html) {
	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'task-line flex',
		template : _.template(Html),

		events : {
			'keyup >.title' : 'onTitleKeyUp',
			'click .go-detail' : 'onGoDetailClick',
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.listenTo(this.model, 'remove', this.remove);
		},

		onRender : function() {
			var self = this;
			var $el = this.$el;
			$el.find('.title').val(this.model.get('title') || '');
			// setTimeout(function() {
			// 	self.$el.find('>.title').focus();
			// })
		},

		onTitleKeyUp : function(evt) {
			if (evt.keyCode == 13) {
				//ENTER
				// evt.preventDefault();
				var sort = this.model.get('sort') + 1;
				this.trigger('addTask', {sort: sort}, {focus: true});
			}
		},

		onGoDetailClick : function() {
			this.trigger('task-detail', this.model);
			//app.router.navigate('task/' + this.model.get('id'));
		},

		focus : function() {
			this.$el.find('>.title').focus();
			return this;
		}
	});

	return View;
});
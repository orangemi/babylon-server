define(['marionette', 'backbone', 'underscore',], function (Marionette, Backbone, _) {
	var InputMenuView = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><span><%=text%></span><span class="edit"><input class="form-control" value="<%=defaultText%>" /></span></a>'),
		className : 'menu_item menu_input',
		events : {
			'focus input' : 'onFocus',
			'blur input' : 'onBlur',
		},

		$span : null,
		$input : null,

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.model.set('text', this.model.get('text') || '');
			this.model.set('disabled', this.model.get('disabled') || false);
			this.model.set('defaultText', this.model.get('defaultText') || '');

			this.listenTo(this.model, 'change:disabled', this.onChangeDisabled);
		},

		onChangeDisabled : function() {
			this.$el.toggleClass('disabled', this.model.get('disabled'));
			this.$input.attr('disabled', this.model.get('disabled'));
		},

		onRender : function() {
			this.$input = this.$el.find('input');
			this.onChangeDisabled();
		},

		onClick : function() {
			this.trigger('click');
		},

		onBlur : function() {
			this.trigger('blur');
		},

		onFocus : function() {
			this.trigger('focus');
		}
	});

	return InputMenuView;
});

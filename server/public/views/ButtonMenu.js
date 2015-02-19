define(['marionette', 'backbone', 'underscore',], function (Marionette, Backbone, _) {
	var ButtonMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		className : 'menu_item menu_button',
		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.model.set('text', this.model.get('text') || '');
			this.model.set('disabled', this.model.get('disabled') || false);

			this.listenTo(this.model, 'change:disabled', this.onChangeDisabled);
		},

		onRender : function() {
			this.onChangeDisabled();
		},

		onChangeDisabled : function() {
			this.$el.toggleClass('disabled', this.model.get('disabled'));
		},

		onClick : function() {
			if (this.model.get('disabled')) return;
			this.trigger('menu:ButtonClick', this);
			this.trigger('closeMenu');
		},
	});

	return ButtonMenu;
});

define(['marionette', 'backbone', 'underscore',], function (Marionette, Backbone, _) {
	var CheckMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		//template : _.template('<a><%=text%></a>'),
		className : 'menu_item menu_check',

		checkStatus : false,

		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.model.set('text', this.model.get('text') || '');
			this.model.set('check', this.model.get('check') || false);
			this.model.set('disabled', this.model.get('disabled') || false);

			this.listenTo(this.model, 'change:disabled', this.onChangeDisabled);
			this.listenTo(this.model, 'change:check', this.onChangeCheck);
		},

		onChangeDisabled : function() {
			this.$el.toggleClass('disabled', this.model.get('disabled'));
		},

		onChangeCheck : function() {
			this.$el.toggleClass('check', this.model.get('check'));
		},

		onRender : function() {
			this.onChangeCheck();
			this.onChangeDisabled();
		},

		onClick : function() {
			if (this.model.get('disabled')) return;
			this.model.set('check', !this.model.get('check'));
			this.trigger('menu:CheckClick', this, this.checkStatus);
		},
	});

	return CheckMenu;
});

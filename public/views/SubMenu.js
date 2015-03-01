define(['marionette', 'backbone', 'underscore', 'views/MenuList'], function (Marionette, Backbone, _, MenuListView) {
	var SubMenu = Marionette.Layout.extend({
		tagName : 'li',
		template : _.template('<a><%=text%></a>'),
		className : 'menu-item menu_sub dropdown-submenu',
		events : {
			'click' : 'onClick',
			'mouseover' : 'onHover',
			'mouseleave' : 'onLeave',
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model || new Backbone.Model();
			this.model.set('text', this.model.get('text') || '');
			this.model.set('disabled', this.model.get('disabled') || false);
			var menus = this.model.get('menus');
			if (!(menus instanceof Backbone.Collection)) {
				menus.forEach(function(menu, i) {
					if (typeof(menu) == 'string') menus[i] = { type: 'button', text: menu};
				});
				menus = new Backbone.Collection(menus);
			}
			this.model.set('menus', menus);
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
			this.toggleActive(true);
			this.trigger('menu:menuClick', this);
			this.openMenu();
		},

		onHover : function() {
			if (this.model.get('disabled')) return;
			this.toggleActive(true);
			this.trigger('menu:menuHover', this);
			this.openMenu();
		},

		openMenu : function() {
			var self = this;
			var subMenu = new MenuListView({ collection : this.model.get('menus') });
			subMenu.on('all', function(event) {
				if (event == 'focus' || event == 'blur' || event == 'closeMenu') {
					self.trigger(event);
					return;
				}
				if (!/^menu:/.test(event)) return;
				self.trigger.apply(self, arguments);
			});

			subMenu.on('close', function() {
				self.toggleActive(false);
			});

			subMenu.show();
			subMenu.setPosition(self.$el.offset().left + self.$el.width(), self.$el.offset().top);
		},

		toggleActive : function(flag) {
			this.$el.toggleClass('active', flag);
		},
	});

	return SubMenu;
});

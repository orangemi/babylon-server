define(['marionette', 'backbone', 'underscore', 'text!html/Tab.html',], function (Marionette, Backbone, _, Html) {
	var TabView = Marionette.Layout.extend({
		tagName : 'li',
		className : 'tab',
		template : _.template('<a><%=name%></a>'),
		isActive : false,

		name : null,
		view : null,

		events : {
			'click' : 'onClick'
		},

		initialize : function(options) {
			options = options || {};
			this.model = options.model;
			//this.view = options.view || new Marionette.Layout();
			this.model.$page = this.model.$page || $('<div>');
			
			//TODO bind event
			this.listenTo(this.model, 'change', this.onModelChange);
		},

		onRender : function() {
			var view = this.model.get('view') || new Marionette.Layout();
			var $content = view.render().$el;
			$content.appendTo(this.model.$page);
		},

		onClick : function() {
			this.model.set('active', true);
		},

		onModelChange : function() {
			var active = this.model.get('active');
			this.toggleActive(active);
			if (active) this.trigger('active', this.model);
		},

		toggleActive : function(flag) {
			if (!flag) flag = false;
			this.$el.toggleClass('active', flag);
		},

		getIndex : function() {
			return this.$el.index();
		},

	});

	var TabListView = Marionette.Layout.extend({
		tagName : 'box',
		template : _.template(Html),
		className : 'tablist',
		$tabs : null,
		$pages : null,

		initialize : function(options) {
			options = options || {};

			var self = this;
			var tabs = this.tabs = options.tabs;

			this.collection = new Backbone.Collection();
			this.listenTo(this.collection, 'add', this.onAddTab);
		},

		onRender : function() {
			var self = this;
			var $tabs = this.$tabs = this.$el.find('.nav-tabs');
			var $pages = this.$pages = this.$el.find('.pages');

			if (this.tabs) this.tabs.forEach(function(tab) {
				self.collection.add(tab);
			});

		},

		onAddTab : function(itemModel) {
			var self = this;
			itemModel.$page = $('<div>').addClass('page').appendTo(this.$pages);
			var tabView = new TabView({model: itemModel});
			tabView.render().$el.appendTo(this.$tabs);

			//TODO bind events
			this.listenTo(tabView, 'active', this.onTabActive);
		},

		onTabActive : function(tabModel) {
			this.collection.forEach(function(model) {
				if (tabModel != model) model.set('active', false);
			});
			//self.trigger('unactive');
			var $page = tabModel.$page;
			var index = $page.index();
			$page.parent().children().css({
				'-webkit-transform' : 'translateX(-' + (index * 100) + '%)',
				'-moz-transform' : 'translateX(-' + (index * 100) + '%)',
				'transform' : 'translateX(-' + (index * 100) + '%)',
			});
		}
	});

	return TabListView;
});
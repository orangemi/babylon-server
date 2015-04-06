define(['marionette', 'underscore', 'app/app', 'text!html/AutoComplete.html'],
function (Marionette, _, app, Html) {
	var View = Marionette.Layout.extend({
		className : 'auto-complete',
		template : _.template(Html),

		events: {
			'blur input' : 'onBlur',
			'focus input' : 'onFocus',
			'click input' : 'onInputClick',
			'keyup input' : 'onKeyUp',
			'keydown input' : 'onKeyDown',
			'click li' : 'onListItemClick',
			// 'click .assignee' : 'onAssigneeClick',
		},

		initialize : function(options) {
			options = options || {};
			this.collection = new Backbone.Collection();
			// this.model = new Backbone.Model();

			this.listenTo(this.collection, 'add', this.onAdd);
			// this.listenTo(this.collection, 'reset', this.onReset);
		},

		onKeyUp: function() {
			var value = this.$input.val();
			this.showPattern(value);
		},

		showPattern : function(pattern) {
			if (!pattern) return;
			this.loadCollection(pattern, this.showList.bind(this));
		},

		loadCollection : function(pattern, callback) {
			callback([]);
		},

		// onReset : function() {
		// 	this.$list.empty();
		// },

		showList : function(list) {
			this.$list.empty().show();
			this.collection.reset();
			this.collection.add(list);
		},

		hideList : function() {
			this.$list.hide();
		},

		onAdd : function(model) {
			$("<li>").html(this.makeHtml(model) || '').appendTo(this.$list);
		},

		makeHtml : function(model) {
			var value = model.get('name') || "";
			return value;
		},

		onRender : function() {
			this.$list = this.$el.find('ul');
			this.$input = this.$el.find('input');
		},

		onInputClick : function() {
			// this.showList('');
		},

		onBlur : function() {
			this.hideList();
		},

		onListItemClick : function(evt) {
			var index = $(evt.currentTarget).index();
			var model = this.collection.at(index);
			this.$input.val(this.makeHtml(model));
			this.hideList();
			this.trigger('select', model, this);
		},

		onKeyDown : function(evt) {
			if (evt.keyCode == 39) {

			}
		},

	});
	return View;
});
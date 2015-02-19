define(['marionette', 'backbone', 'underscore'], function (Marionette, Backbone, _) {
	var View = Marionette.Layout.extend({
		tagName : 'tr',
		className : 'row data-row',
		template : _.template(''),
		columns : null,

		initialize : function(options) {
			options = options || {};
			this.columns = options.columns || [];
			this.model = options.model || new Backbone.Model();

			this.listenTo(this.columns, 'change', this.onColumnChange);
			this.listenTo(this.model, 'remove', this.close);
		},

		onColumnChange : function(column) {
			var index = this.columns.indexOf(column);
			var $td = this.$el.children().eq(index);
			
			if (column.get('hide')) $td.hide();
			else $td.show();
		},

		onRender : function() {
			var self = this;
			this.columns.forEach(function(column) {
				//render by func
				var func = column.get('render');
				var $td = $('<td>').appendTo(self.$el);

				//column attrib
				self.onColumnChange(column);

				if (typeof(func) != 'function') {
					var cellType = column.get('type') || 'normal';
					func = self.getCellRenderFunc(cellType, column);
				}
				func(self.model, $td);

			});
		},

		getCellRenderFunc : function(cellType, column) {
			var row = this;
			switch (cellType){
				case 'normal' :
				return function(model, $td) {
					$td.html(model.get(column.get('name')));
				};
				case 'input' :
				return function(model, $td) {
					var $input = $('<input>').val(model.get(column.get('name'))).appendTo($td);
					$input.change(function() {
						model.set(column.get('name'), $input.val());
					});
				};
				case 'button' :
				return function(model, $td) {
					var $button = $('<button>').html(column.get('name')).appendTo($td);
					$button.click(function() {
						row.trigger('buttonClick', column, model);
						row.trigger('buttonClick.' + column.name, column, model);
					});
				};
				default:
				return function() {};
			}
		}
	});
	return View;
});

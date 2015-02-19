define(['marionette', 'underscore', 'app/app', 'text!html/Table.html', 'views/Row', 'views/Menu'], function (Marionette, _, app, TableHtml, TableRowView, MenuView) {
	var View = Marionette.Layout.extend({
		tagName : "table",
		className : "table table-condensed table-hover",
		template : _.template(TableHtml),

		caption : null,
		$caption : null,
		$thead : null,
		$tbody : null,
		columns : null,
		data : null,

		page : 1,
		pagesize : 10,

		initialize : function(options) {
			options = options || {};
			this.columns = new Backbone.Collection();
			this.data = new Backbone.Collection();
			this.caption = options.caption || '';
			this.page = 1;
			this.pagesize = options.pagesize || 0;

			//bind event
			this.listenTo(this.columns, 'change', this.onColumnChange);
			this.listenTo(this.columns, 'add', this.onAddColumn);
			this.listenTo(this.columns, 'remove', this.onRemoveColumn);
			
			this.listenTo(this.data, 'change', this.onRowChange);
			this.listenTo(this.data, 'add', this.onAddRow);
			// this.listenTo(this.data, 'remove', this.onRemoveRow);
			this.listenTo(this.data, 'reset', this.onResetTable);

			if (options.columns) this.columns.add(options.columns);
		},

		onResetTable : function() {
			if (!this.$tbody) return;
			this.$tbody.find('tr').not('.thead').remove();
		},

		onAddRow : function(model) {
			if (!this.$tbody) return;
			var self = this;
			var rowView = new TableRowView({
				model : model,
				columns : this.columns,
			});
			
			//TODO: add listeners
			this.listenTo(rowView, 'all', function() {
				self.trigger.apply(self, arguments);
			});

			this.renderRow(rowView);
		},

		onRender : function() {
			this.$tbody = this.$el;
			this.renderCaption();
			this.renderColumns();
			this.renderRows();
		},

		renderCaption : function() {
			var $caption = this.$caption;
			if (!$caption) $caption = this.$caption = $('<caption>').appendTo(this.$el);
			$caption.html(this.caption);

			//TODO add column selector in caption section.
			//TODO add page selector in caption section.
			// << Prev       Caption (1 / N)       Next >>
		},
		renderRow : function(rowView) {
			rowView.render().$el.appendTo(this.$tbody);
		},

		onAddColumn : function(column) {
			var self = this;
			if (!this.$thead) return;
			if (!column.get('title')) {
				column.set('title', column.get('name'));
			}
			var $td = $('<th>').html(column.get('title')).appendTo(this.$thead);

			//add menu to cell
			var $button = $('<span>').html('&#9660;').appendTo($td);
			$button.click(function(evt) {
				var menuView = new MenuView({menus : [
					'hide',
					'sort A-Z',
					'sort Z-A',
				]});
				menuView.on('menu:ButtonClick', function(view) {
					if (view.model.get('text') == 'hide') column.set('hide', true);
					else if (view.model.get('text') == 'sort A-Z') self.sort(column, true);
					else if (view.model.get('text') == 'sort Z-A') self.sort(column, false);
				});
				app.showMenu(menuView, $button.offset().left, $button.offset().top);
			});

			if (column.get('hide')) $td.hide();
			else $td.show();
		},

		sort : function(column, isAsc) {
			var index = this.columns.indexOf(column);
			var length = this.$el.find('.data-row').length;
			for (var j = 1; j < length; j++) {
				var $rows = this.$el.find('.data-row');
				$row = $rows.eq(j);
				var value = $row.children().eq(index).html();
				for (var i = 0; i < j; i++) {
					var $target = $rows.eq(i);
					var targetValue = $target.children().eq(index).html();
					if (isAsc && value < targetValue) {
						// debugger;
						$row.insertBefore($target);
						break;
					} else if (!isAsc && value > targetValue) {
						$row.insertBefore($target);
						break;
					}
				}
			}
		},

		onColumnChange : function(column) {
			if (!this.$thead) return;
			var index = this.columns.indexOf(column);
			var $td = this.$thead.children(':eq(' + index + ')');
			if (column.get('hide')) $td.hide();
			else $td.show();
		},

		renderColumns : function() {
			var self = this;
			var $thead = this.$thead = $('<tr>').addClass('thead row').appendTo(this.$tbody);
			this.columns.forEach(function(column) {
				self.onAddColumn(column);
			});
		},

		renderRows : function() {
			var self = this;
			this.data.forEach(function(model) {
				self.onAddRow(model);
			});
		},

		renderReset : function(){
			this.data.reset();
		}
	});
	return View;
});

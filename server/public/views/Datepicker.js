define([
'marionette', 'underscore', 'text!html/CalendarPicker.html'],
function (Marionette, _, CalendarHtml) {

	var View = Marionette.Layout.extend({
		tagName : 'table',
		className : 'calendar-picker',
		template : _.template(CalendarHtml),

		year	: 0,
		month	: 0,
		day		: 0,

		events : {
			'click td' : 'chooseDay',
			'mousedown' : 'onMouseDown',
//			'blur' : 'onBlur',
//			'focus' : 'onFocus',
			'click button.prev' : 'goPrevMonth',
			'click button.next' : 'goNextMonth',
		},

		onRender : function() {
			// this.$el.html(this.template({}));
			// this.$el.attr('tabindex', -1);
			var self = this;
			this.$tbody = this.$el.find('tbody');
			this.$title = this.$el.find('caption h6');
			this.setCurrentDate(new Date());
			// this.$el.attr('tabindex', -1);
			// setTimeout(function() {
			// 	self.$el.focus();
			// });

			// return this;
		},

		// onFocus : function() {
		// 	console.log('calendar focus');
		// },

		// onBlur : function() {
		// 	this.remove();
		// },

		goNextMonth : function() {
			console.log(this.year, this.month);
			var date = new Date();
			date.setYear(this.year);
			date.setMonth(this.month + 1);
			this.renderCalendar(date);
		},

		goPrevMonth : function() {
			var date = new Date();
			date.setYear(this.year);
			date.setMonth(this.month - 1);
			this.renderCalendar(date);
		},

		setCurrentDate : function(today) {
			var theDate = this.date = new Date(today);
			theDate.setHours(0,0,0,0);
			this.renderCalendar(theDate);
		},

		setPosition : function(x, y) {
			this.$el.css('left', x + 'px');
			this.$el.css('top', y + 'px');
		},

		getMonthDesc : function(month) {
			return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month];
		},

		renderCalendar : function(date) {
			var theDate = new Date(date);
			var today = new Date();
			today.setHours(0,0,0,0);
			theDate.setDate(1);

			var weekday = theDate.getDay();
			var theYear = this.year = theDate.getFullYear();
			var theMonth = this.month = theDate.getMonth();
			
			theDate.setDate(1 - weekday);

			var self = this;
			this.$title.html(theYear + ' / ' + this.getMonthDesc(theMonth));
			this.$el.find('td').each(function(i, html) {
				var date = new Date(theDate);
				date.setTime(date.getTime() + i * 86400 * 1000);
				$(html).html(date.getDate())
					.toggleClass('month', date.getMonth() == theMonth)
					.toggleClass('select',
						date.getFullYear() == self.date.getFullYear() &&
						date.getMonth() == self.date.getMonth() &&
						date.getDate() == self.date.getDate()
					)
					.toggleClass('today',
						date.getFullYear() == today.getFullYear() &&
						date.getMonth() == today.getMonth() &&
						date.getDate() == today.getDate()
					);
			});
		},

		onMouseDown : function(event) {
			event.preventDefault();
		},

		chooseDay : function(event) {
			var $td = $(event.currentTarget);
			var weekday = $td.index();
			var week = $td.parent().index() - 1;
			
			var date = new Date();
			date.setHours(0,0,0,0);
			date.setYear(this.year);
			date.setMonth(this.month);
			date.setDate(1);
			date.setDate(1 - date.getDay());

			date.setTime(date.getTime() + (week * 7 + weekday) * 86400 * 1000);
			// console.log('choose' + date);
			this.trigger('choose ', date, this);
			// this.$el.blur();
		}
	});

	return View;

});
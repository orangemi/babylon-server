define([
'marionette', 'underscore', 'text!html/TimePicker.html'],
function (Marionette, _, TimeHtml) {

	var View = Marionette.Layout.extend({
		tagName : 'ul',
		className : 'time-picker',
		template : _.template(TimeHtml),

		year	: 0,
		month	: 0,
		day		: 0,

		events : {
			'click li' : 'chooseTime',
			'mousedown' : 'onMouseDown',
		},

		onRender : function() {
		},

		setCurrentDate : function(today) {
		},

		setPosition : function(x, y) {
			this.$el.css('left', x + 'px');
			this.$el.css('top', y + 'px');
		},

		onMouseDown : function(event) {
			event.preventDefault();
		},

		chooseTime : function(evt) {
			var str = $(evt.currentTarget).html();
			var timeArray = str.split(':');
			var date = new Date();
			// date.setHours
			date.setHours(timeArray[0], timeArray[1]);
			this.trigger('choose', date);
		},

	});

	return View;

});
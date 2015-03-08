define([
	'marionette', 'underscore', 'app/app', 'text!html/CommentLine.html', 'models/Task'],
function (Marionette, _, app, Html, Task) {

	var pastTimeString = function(date) {
		var now = new Date();
		var diff = (now.getTime() - date.getTime()) / 1000;
		if (diff < 0) return 'In the future';
		var year = Math.floor(diff / 86400 / 365);
		if (year > 0) return [year, ' year', year > 1 ? 's' : '', ' ago'].join('');
		var month = Math.floor(diff / 86400 / 30);
		if (month > 0) return [month, ' month', month > 1 ? 's' : '', ' ago'].join('');
		var day = Math.floor(diff / 86400);
		if (day > 0) return [day, ' day', day > 1 ? 's' : '', ' ago'].join('');
		var hour = Math.floor(diff / 3600);
		if (hour > 0) return [hour, ' hour', hour > 1 ? 's' : '', ' ago'].join('');
		var minute = Math.floor(diff / 60);
		if (minute > 0) return [minute, ' minute', minute > 1 ? 's' : '', ' ago'].join('');
		return 'Just now';

	};

	var View = Marionette.Layout.extend({
		tagName : 'li',
		className : 'comment-line',
		template : _.template(Html),

		events : {
		},

		initialize : function(options) {},

		onRender : function() {
			this.$el.find('.post-user').html('SomeOne');
			this.$el.find('.post-time').html(pastTimeString(new Date(this.model.get('createtime') * 1000)));
			this.$el.find('.post-content').html(this.model.get('message'));
		},

		onRemoveClick : function() {
		},
	});

	return View;
});
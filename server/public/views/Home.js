define([
'marionette', 'underscore', 'app/app', 'text!html/Home.html', 'views/TaskList'],
function (Marionette, _, app, Html, TaskList) {
	var HomeView = Marionette.Layout.extend({
		id : 'home',
		className : 'flex home',
		template : _.template(Html),

		regions : {
			"topRegion" : ">.top",
			"leftRegion" : ">.left",
			"bodyRegion" : ">.body",
			"bottomRegion" : ">.bottom",
			"popRegion" : ">.pop",
		},

		initialize : function() {},

		onRender : function() {
			var taskList = new TaskList();
			
		},

		showPop : function(view) {
			this.popRegion.show(view);
			var pops = this.$el.find('>.pop').removeClass('hide');
			view.on('close', function() {
				if (pops.length == 1) pops.addClass('hide');
			});
		}
	});

	return HomeView;
});
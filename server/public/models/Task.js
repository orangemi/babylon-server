define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils'],
function (Backbone, _, $, app, Utils) {

	var Model = Backbone.Model.extend({

		save : function(options) {
			options = options || {};
			var id = this.id || '';
			var data = options.empty ? {} : this.getJSON();
			Utils.post('task/' + id, data, function() {

			});
		},

		sync : function() {

		},

		assignTo : function(person) {
			if (!this.id) {
				console.error('Task can not be assign without id.');
				return;
			}

		},

		getJSON : function() {
			return $.extend({}, this.attributes);
		},

	});

	return Model;
});
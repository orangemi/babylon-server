define(
['backbone', 'underscore', 'jquery', 'app/app', 'models/Utils', 'models/Person'],
function (Backbone, _, $, app, Utils, Person) {

	var Collection = Backbone.Collection.extend({
		model : Person,

		search : function(word, options, callback) {
			callback = typeof(callback) == 'function' ? callback : Utils.emptyFn;
			var uri = ['search'].join('/');
			var post = {
				types: ['person'],
				organization_id: null,
				word: word,
			};
			Utils.post(uri, post, function(rep) {
				callback(rep);
			});
		},
	});

	return Collection;
});
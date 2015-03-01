define(['jquery', 'backbone'], function ($, Backbone) {
	var rand = function(start, end) {
		var array = [];
		if ($.isArray(start)) {
			array = start;
		} else {
			for (var i = start; i <= end; i++) array.push(i);
		}
		var index = Math.floor(array.length * Math.random());
		return array[index];
	};

	var FakeModels = {
		getFakeModel : function(type, model, options) {
			var fakexhr = {};
			var isCollection = model instanceof Backbone.Collection;
			model.trigger('request', model, fakexhr, options);
			
			var resp = this.getFakeJson(type, isCollection);

			if (resp) {
				setTimeout(function() {
					if (options.success) options.success(resp);
				}, 10);
			} else {
				setTimeout(function() {
					if (options.error) options.error('fake error');
				}, 10);			
			}
		},
		getFakeJson : function(type, isCollection) {
			var i, l, collection = [];
			if (isCollection) {
				l = rand(1, 9);
				for (i = 0; i < l; i++) {
					collection.push(this.getFakeJson(type));
				}
				return collection;
			} else if (type == 'hero') {
				return {
					id : rand(1, 9),
					hero_id : rand(1, 9),
					grade : rand(1, 9),
				}
			} else {
				console.error('fake type not found : ' + type);
				return {};
			}
		}
	};
	return FakeModels;
});
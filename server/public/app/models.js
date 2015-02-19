define(['backbone', 'underscore', 'jquery', 'app/app', 'app/models.debug.js'], function (Backbone, _, $, app, FakeModels) {
	var models = {};
	var get = models.get = function(path ,data, callback) {
		ajax('GET', path, data, callback);
	};

	var post = models.post = function(path, data, callback) {
		ajax('POST', path, data, callback);
	};

	var ajax = models.ajax = function(method, path, data, callback) {
		method = method || 'GET';
		$.ajax({
			url : path,
			// url : app.data.requestUrl + path,
			type : method,
			data : method == 'GET' ? data : JSON.stringify(data),
			dataType : 'json',
			processData : method == 'GET',
			success : function(rep) {
				var preProcess = null;
				if (!rep || rep.error) preProcess = onError(rep);
				if (preProcess) return;
				callback(rep);
			},
		});
	};

	var onError = models.onError = function(rep) {
		if (rep.error == 401) {
			app.router.navigate('login', {trigger: true});
			return true;
		}
		// debugger;
	};

	var BaseModel = models.BaseModel = Backbone.Model.extend({
		type : 'base',
		initialize : function(attrs, options) {
			//TODO listen events;
			return Backbone.Model.prototype.initialize.apply(this, arguments);
		},
		sync : function(methods, model, options) {
			if (!app.config.get('release') && app.config.get('isLocalModel')) {
				FakeModels.getFakeModel(this.type, this, options);
				return;
			}

			return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});

	var BaseCollection = models.BaseCollection = Backbone.Collection.extend({
		model : BaseModel,
		initialize : function(array, options) {
			//TODO lisn events;
			return Backbone.Collection.prototype.initialize.apply(this, arguments);
		},
		sync : function(methods, collection, options) {
			if (!app.config.get('release') && app.config.get('isLocalModel')) {
				FakeModels.getFakeModel(this.model.prototype.type, this, options);
				return;
			}

			return Backbone.Model.prototype.sync.apply(this, arguments);
		}
	});

	var HeroModel = models.HeroModel = BaseModel.extend({
		type : 'hero'
	});

	var HeroCollection = models.HeroCollection = BaseCollection.extend({
		model : HeroModel
	});

	return models;
});
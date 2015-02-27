define(
['backbone', 'underscore', 'jquery', 'app/app'],
function (Backbone, _, $, app) {
	var emptyFn = function() {};
	var utils = {};
	var get = utils.get = function(path ,data, callback) {
		ajax('GET', path, data, callback);
	};

	var post = utils.post = function(path, data, callback) {
		ajax('POST', path, data, callback);
	};

	var ajax = utils.ajax = function(method, path, data, callback) {
		callback = typeof(callback) == 'function' ? callback : emptyFn;
		method = method || 'GET';
		$.ajax({
			url : path,
			// url : app.data.requestUrl + path,
			type : method,
			data : method == 'GET' ? data : JSON.stringify(data),
			dataType : 'json',
			processData : method == 'GET',
			success : function(rep) {
				//var preProcess = null;
				//if (!rep || rep.error) preProcess = onError(rep);
				//if (preProcess) return;
				try {
					if (!rep) throw "no response";
					if (rep.error) throw rep.error;
					callback(rep);
				} catch (e) {
					app.showDialog({ icon: 'warning', title: 'Ajax Error', content: e });
				}
			},

			error : function(xhr, status, error) {
				//TODO
				console.error('ajax error (code: ' + status + '): ', error);
			},
		});
	};

	var onError = utils.onError = function(rep) {
		if (rep.error == 401) {
			app.router.navigate('login', {trigger: true});
			return true;
		}
		// debugger;
	};

	return utils;
});

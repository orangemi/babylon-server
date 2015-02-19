define(['minify',
	'backbone',
	], function (minify, Backbone) {
		var str2json = function(string) {
			var result;
			result = JSON.parse(JSON.minify(string));	
			return result;
		};

		var str2collection = function(string) {
			var result;
			result = new Backbone.Collection(str2json(string));
			return result;
		};

		var ajax = function(method, path, data, callback) {
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
					callback(rep);
				},
			});
		};

		var data = {
			loadCollection : function(callback) {
				var length = names.length;
				var loaded = 0;
				var checkLast = function() {
					if (loaded >= length) return callback(length);
				}
				names.forEach(function(name) {
					ajax(null, 'data/' + name, {}, function(rep) {
						var output = rep.output;
						data[name + 'Collection'] = new Backbone.Collection(output);
						loaded++;
						checkLast();
					});
				});
			}

		};

		// var config = str2json(Config); 
		// data.remoteLoadDataConfig = config.dataConfig;
		// data.requestUrl =config.requestUrl;
		// data.dataRequestUrl = config.dataRequestUrl;



		// data.itemCollection = new Backbone.Collection(JSON.parse(items).output);
		// data.equipCollection = new Backbone.Collection(JSON.parse(equips).output);
		// data.gemCollection = new Backbone.Collection(JSON.parse(gems).output);
		// data.materialCollection = new Backbone.Collection(JSON.parse(materials).output);
		// data.troopCollection = new Backbone.Collection(JSON.parse(troops).output);
		// data.missionCollection = new Backbone.Collection(JSON.parse(missions).output);
		// data.talentCollection = new Backbone.Collection(JSON.parse(talent).output);
		// data.alliance_giftCollection = new Backbone.Collection(JSON.parse(alliance_gift).output);
		return data;
});
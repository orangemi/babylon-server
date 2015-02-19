define(['text!app/config/config.json', 'minify'], function (configString) {
	var _config = JSON.parse(JSON.minify(configString));
	var Config = {
		get : function(key) {
			var value = _config[key];
			return _config[key];
			//else return null;
		},
		set : function (key, value) {
			_config[key] = value;
			return this;
		}
	};
	return Config;
});

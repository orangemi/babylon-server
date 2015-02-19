require.config({

	//dependency
	shim: {
		underscore: {exports: '_'},
		marionette: {
			deps: ['jquery', 'underscore', 'backbone'],
			exports: 'Marionette',
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone',
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store',
		}
	},

	//public lib
	paths: {
		jquery : 'vender/jquery-2.0.3',
		underscore : 'vender/underscore-1.5.2',
		backbone : 'vender/backbone-1.1.0',
		backboneLocalstorage : 'vender/backbone.localstorage',
        text: 'vender/requirejs.text-2.0.10',
        marionette : 'vender/marionette-1.4.1',
		minify : 'vender/minify.json-0.1',
		models : 'models',
		views : 'views',
		html : 'html',
	}
});

//init env
(function (global) {

	var url = (function (location) {
		var result = {
			href : location.href,
			protocol : location.protocol,
			host : location.host,
			port : location.port || 80,
			hostname : location.hostname,
			pathname : location.pathname,
			search : location.search.replace(/^\?/, ''),
			hash : location.hash.replace(/^#/, ""),
			querys : {}
		};
		location.search.replace(/^\?/, '').split('&').forEach(function (queryStr) {
			var query = queryStr.split('=');
			result.querys[query[0]] = decodeURIComponent(query[1]);
		});
		return result;
	})(global.location);

	var env = global.env = {
		isBrowser : true,
		global : global,

		//agent info
		platform: global.navigator.platform,
		agent : global.navigator.userAgent,
		language : global.navigator.language,

		//screen info
		width : global.screen.width,
		height : global.screen.height,

		//storage
		localStorage : global.localStorage,
		sessionStorage : global.sessionStorage,

		//browser specific object
		url : url
	};
	return env;
})(window);

require(['app/app', 'app/router'], function(app, Router) {
	$(document).ready(function() {
		console.log("DOM is ready");
		
		app.router = new Router(app);
		app.start();
	});
});
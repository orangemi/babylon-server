({
	mainConfigFile: 'main.js',
    // baseUrl: ".",
    // dir: "../appdirectory-build",
  //   paths : {
		// //public lib
		// jquery : 'vender/jquery-2.0.3',
		// underscore : 'vender/underscore-1.5.2',
		// backbone : 'vender/backbone-1.1.0',
		// backboneLocalstorage : 'vender/backbone.localstorage',
  //       text: 'vender/requirejs.text-2.0.10',
  //       marionette : 'vender/marionette-1.4.1',
		// minify : 'vender/minify.json-0.1',
		// bootstrap : 'vender/bootstrap-3.2.0',
		// cookie : 'vender/Cookie-0.3.0',
  //       //project lib
		// models : 'models',
		// views : 'views'

  //   },
    // name: 'main',
    preserveLicenseComments: false,
    dir: '../zeus_build',
    optimizeCss: 'standard',
    modules: [
      {
        name: 'app/views/menu/Menu',
        exclude : ['marionette', 'backbone', 'underscore', ],
      },
      {
        name: 'app/views/table/Table',
        exclude : ['marionette', 'underscore', 'app/app', ],
      },

      {
        name: 'main',
      },
      {
        name: 'app/views/ActivityList',
        include : ['app/views/Activity' ],
        exclude : ['marionette', 'underscore', 'app/app', 'app/views/menu/Menu', 'app/views/table/Table', ],
        // include: ['app/views/UserSearch','app/views/table/Table', 'app/models'],
      },

    ],
    //out: 'main-build.js',
})
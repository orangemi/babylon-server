define([
'marionette', 'underscore', 'app/app', ],
function (Marionette, _, app) {
	var View = Marionette.Layout.extend({
		tagName : 'ul'
	});
	return View;
});

define([
'marionette', 'underscore', 'app/app', 'text!html/Login.html', 'views/Menu', 'app/models'],
function (Marionette, _, app, Html, MenuView, Models) {
	var View = Marionette.Layout.extend({
		className : 'login_panel',
		template : _.template(Html),
		events : {
			'click .login' : 'onLoginClick',
			'keyup input' : 'onKeyUp',
			'click .forget' : 'onForgetClick',
		},

		onKeyUp : function(evt) {
			if (evt.keyCode == 13) this.onLoginClick();
		},

		onRender : function() {
			// debugger;
		},

		onLoginClick : function() {
			var self = this;
			var email = this.$el.find('.email').val();
			var password = this.$el.find('.password').val();
			var data = {
				email : email,
				password : password,
			};
			this.showLoading();
			Models.get('login', data, function(rep) {
				self.hideLoading();
				if (!rep || rep.error) return self.onLoginError(rep.output);

				app.data.nickname = rep.output.nick;
				//TODO show nickname

				app.data.loadCollection(function() {
					app.router.navigate('user', {trigger : true});
				});
			});
		},

		showLoading : function() {
			$("<div>").addClass("loading").appendTo(this.$el);
		},

		hideLoading : function() {
			this.$el.children(".loading").remove();
		},

		onForgetClick : function(){
			var self = this;
			var email = this.$el.find('.email').val();
			var password = this.$el.find('.password').val();
			var data = {
				email : email,
				password : password,
			};
			Models.get('forget', data, function(rep) {
				if (!rep || rep.error) return self.onLoginError(rep.output);
				app.showDialog({title: "Success", content: "Email has sent to " + email + ' .'});
			});
		},

		onLoginError : function(content) {
			app.showDialog({title: "Error", content: "Sorry, you can not login. Following message may be help.<br/>" + content});
		},
	});
	return View;	
});

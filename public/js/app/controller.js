define([
	'app/app',
	'app/views/home/main'
], function (App, HomeMain) {

	return {
		home: function () {
			var homeMain;
			homeMain = new HomeMain(function (view) {
				App.content.show(view);
			});
		}
	};
});
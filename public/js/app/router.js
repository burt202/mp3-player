'use strict';

define([
	'marionette',
	'app/controller'
], function (Marionette, Controller) {

	var Router = Marionette.AppRouter.extend({
		appRoutes: {
			'': 'home'
		}
	});

	return new Router({
		controller: Controller
	});
});
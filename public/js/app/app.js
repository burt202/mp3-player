'use strict';

define([
	'marionette',
	'backbone'
], function (Marionette, Backbone) {

	var app = new Marionette.Application();

	app.addRegions({
		content: '#main'
	});

	app.addInitializer(function () {
		Backbone.history.start();
	});

	return app;
});
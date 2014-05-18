var jsdom = require('jsdom'),
	requirejs = require('requirejs');

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = global.document.parentWindow;

requirejs.config({
	baseUrl: __dirname + '/../public/js/libs',
	paths: {
		app: '../app',
		templates: '../../templates'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		marionette: {
			deps: ['backbone'],
			exports: 'Backbone.Marionette'
		}
	}
});

var jQuery = requirejs('jquery');

global.$ = jQuery;
define([], function () {
	return {
		baseUrl: 'public/js/libs',
		paths: {
			app: '../app',
			templates: '../../templates',
			tests: '../../tests/'
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
	};
});
var jQuery = require('../public/bower_components/jquery/dist/jquery');
var jsdom = require('jsdom');

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = global.document.parentWindow;
global.$ = jQuery;

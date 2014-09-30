var requirejsConfig;

/* global requirejs */
/* jshint -W020 */
requirejs = {
    config: function (options) {
        requirejsConfig = options;
    }
};

require('../public/js/config.js');
requirejs = null;

requirejsConfig.baseUrl = 'bower_components';
requirejsConfig.suppress = { nodeShim: true };
requirejsConfig.nodeRequire = require;

module.exports = require('requirejs').config(requirejsConfig);

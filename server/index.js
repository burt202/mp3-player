'use strict';

var swig = require('swig');

var IndexController = function (config) {
  this.config = config;

  this.load = function (req, res) {
    var urlOverride = false;

    if (req.query.rawAssets !== undefined) {
      urlOverride = true;
    }

    var tpl = swig.renderFile('public/templates/layout.html', {
      envType: this.config.type,
      urlOverride: urlOverride,
      mp3s: []
    });

    res.set('Content-Type', 'text/html');
    res.send(tpl);
  };
};

module.exports = IndexController;

'use strict';

var swig = require('swig');
var mp3Parser = require('./mp3-parser');

var IndexController = function (config) {
  this.config = config;

  this.load = function (req, res) {
    var urlOverride = false;
    var dirPath = __dirname + '/../public/mp3s/';
    var parsed = mp3Parser(dirPath).map(function (mp3) {
      mp3.path = 'mp3s/' + mp3.fileName;
      return mp3;
    });

    if (req.query.rawAssets !== undefined) {
      urlOverride = true;
    }

    var tpl = swig.renderFile('public/templates/layout.html', {
      envType: this.config.type,
      urlOverride: urlOverride,
      mp3s: parsed
    });

    res.set('Content-Type', 'text/html');
    res.send(tpl);
  };
};

module.exports = IndexController;

'use strict';

var express = require('express'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  IndexController = require(__dirname + '/server/index'),
  config = JSON.parse(fs.readFileSync(__dirname + '/configs/app.json', 'utf8')),
  app = express();

var controller = new IndexController(config);

/*jshint -W030 */
app.use(bodyParser.json()),
app.use(express.static(__dirname + '/public'));

app.get('*', controller.load.bind(controller));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

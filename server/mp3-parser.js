'use strict';

var fs = require('fs');
var path = require('path');
var mp3Parser = require('mp3-parser');

var toArrayBuffer = function (buffer) {
  var bufferLength = buffer.length, i = 0;
  var uint8Array = new Uint8Array(new ArrayBuffer(bufferLength));

  for (; i < bufferLength; ++i) { uint8Array[i] = buffer[i]; }
  return uint8Array.buffer;
};

var parseFilesInDirectory = function (dirPath) {
  var metadata = [];
  var count = 1;

  var fileNames = fs.readdirSync(dirPath);

  fileNames.forEach(function (fileName) {
    var filePath = dirPath + fileName;

    if (path.extname(filePath) === '.mp3') {
      var file = fs.readFileSync(filePath);
      var buffer = new DataView(toArrayBuffer(file));
      var tags = mp3Parser.readTags(buffer);

      var stats = fs.statSync(filePath);
      var bitrate = tags[1].header.bitrate;
      var size = stats.size;
      var length = parseInt(((size / 1000) * 8) / bitrate);

      var info = {
        id: count,
        artist: tags[0].frames[1].content.value,
        title: tags[0].frames[0].content.value,
        album: tags[0].frames[3].content.value,
        genre: tags[0].frames[2].content.value,
        year: tags[0].frames[4].content.value,
        length: length,
        bitrate: bitrate,
        size: size,
        fileName: fileName
      };

      metadata.push(info);
      count++;
    }
  });

  return metadata;
};

module.exports = parseFilesInDirectory;

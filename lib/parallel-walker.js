/*
 * parallel-walker
 * https://github.com/thealah/parallel-walker
 *
 * Copyright (c) 2013 Stephen England
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  events = require('events'),
  path = require('path');

function walkDirectory (dir, emitter) {
  fs.readdir(dir, function (err, list) {
    if (err) {
      emitter.emit('error', err);
    }
    else {
      if (list.length) {
        list.forEach( function(file) {
          file = path.join(dir, file);
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              emitter.emit('directory', file);
              walkDirectory(file, emitter);
            }
            else {
              emitter.emit('file', file);
            }
          });
        });
      }
    }
  });
}

module.exports = {
  create : function () {
    var walker = new events.EventEmitter();

    walker.walk = function(dir) {
      walkDirectory(dir, this); 
    };

    return walker;
  }
};
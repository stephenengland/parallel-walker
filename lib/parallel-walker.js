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

function walkDirectory (dir, emitter, endCallback) {
  fs.readdir(dir, function (err, list) {
    if (err) {
      emitter.emit('error', err);
    }
    else {
      if (list.length) {
		var statCallsCompleted = 0,
			directoriesCompleted = 0,
			directoriesNeedCompleting = 0;
        list.forEach( function(file) {
			file = path.join(dir, file);
			fs.stat(file, function(err, stat) {
				statCallsCompleted++;
				if (stat && stat.isDirectory()) {
					directoriesNeedCompleting++;
					emitter.emit('directory', file);
					walkDirectory(file, emitter, function () {
						directoriesCompleted++;
						if (statCallsCompleted === list.length && directoriesNeedCompleting === directoriesCompleted) {
							if (endCallback) {
								endCallback();
							}
							else {
								emitter.emit('end');
							}
						}
					});
				}
				else {
					emitter.emit('file', file);
				}

				if (statCallsCompleted === list.length && directoriesNeedCompleting === directoriesCompleted) {
					if (endCallback) {
						endCallback();
					}
					else {
						emitter.emit('end');
					}
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
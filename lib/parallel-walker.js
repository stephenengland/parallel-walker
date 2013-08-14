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

function endThisScope(emitter, endCallback) {
	if (endCallback) {
		endCallback();
	}
	else {
		emitter.emit('end');
	}
}
  
function walkDirectory (dir, emitter, endCallback) {
  fs.readdir(dir, function (err, list) {
    if (err) {
		emitter.emit('error', err);
		endThisScope(emitter, endCallback);
    }
    else {
		if (list.length) {
			var statCallsCompleted = 0,
				directoriesCompleted = 0,
				directoriesNeedCompleting = 0;
			list.forEach( function(file) {
				file = path.join(dir, file);
				fs.stat(file, function(err, stat) {
					if (err) {
					  emitter.emit('error', err);
					}
					statCallsCompleted++;
					if (stat && stat.isDirectory()) {
						directoriesNeedCompleting++;
						emitter.emit('directory', file);
						walkDirectory(file, emitter, function () {
							directoriesCompleted++;
							if (statCallsCompleted === list.length && directoriesNeedCompleting === directoriesCompleted) {
								endThisScope(emitter, endCallback);
							}
						});
					}
					else {
						emitter.emit('file', file);
					}

					if (statCallsCompleted === list.length && directoriesNeedCompleting === directoriesCompleted) {
						endThisScope(emitter, endCallback);
					}
				});
			});
		}
		else {
			endThisScope(emitter, endCallback);
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
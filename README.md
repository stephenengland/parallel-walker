# parallel-walker

A Node.js recursive directory walker that reads directories in parallel with an event interface.

## Getting Started
Install the module with: `npm install parallel-walker`

```javascript
var pw = require('parallel-walker');

var walkerObject = pw.create();

walkerObject.on('file', function(file) {
	console.log(file);
});

walkerObject.on('directory', function(directory) {
	console.log(directory);
});

walkerObject.on('error', function(error) {
	console.log(error);
});

walkerObject.walk(searchDir);
```

## License
Copyright (c) 2013 Stephen England  
Licensed under the MIT license.

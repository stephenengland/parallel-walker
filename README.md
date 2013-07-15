# parallel-walker

A Node.js recursive directory walker that reads directories in parallel with an event interface.

WARNING: Walking directories in parallel can consume a lot of memory. It is not recommended to use this on very large directory structures without properly testing the memory consumption!

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

walkerObject.on('end', function(){
	console.log('finished');
});

walkerObject.walk(searchDir);
```

## License
Copyright (c) 2013 Stephen England  
Licensed under the MIT license.

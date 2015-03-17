var p2r = require('path-to-regexp');
var path = '';
var regex = p2r(path, {end: false});
var result = regex.exec('/abc/123/456');
//path = result.shift();
console.log(regex.keys);

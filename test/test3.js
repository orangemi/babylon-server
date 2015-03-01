// test3.js
var Router = require('../lib/Router');

// console.log(Router);
var r1 = new Router();
var r2 = new Router();

r2.get('/', function() {
	console.log('r2');
});

r1.use('/abc', r2);

console.log(r1.callbacks);
console.log(r2.callbacks);
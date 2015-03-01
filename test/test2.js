var Then = require('thenjs');

Then.parallel([
	function(then) {
		console.log('first');
		then(null, 1);
	},
	function(then) {
		console.log('second but do nothing');
		then(null, 20);
	},
]).then(function(then, result) {
	console.log('last', result);
});
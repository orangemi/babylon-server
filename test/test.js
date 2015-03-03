var mysql = require('mysql');
var Then = require('thenjs');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

body = '{"types":["task"],"organization_id":null,"word":"aa"}';
post = body ? JSON.parse(body) : {};
var types = post.types || [];
var word = post.word || '';

Then(function(then) {
	then(null, 'params');
}).parallel([
	function(then, params) {
		console.log(1, arguments);
		if (types.indexOf('task') == -1) then(null, []);
		Task.find({
			status : Task.STATUS.NORMAL,
			//organization_id : post.organization_id,
			'title LIKE' : ['%', post.word, '%'].join(''),
			//TODO may be need to add description search...
		}, then);
	},
	function(then, params) {
		console.log(2, arguments);
		then();
//		throw "Some Error";
	}, //TODO add find tag
]).then(function(then, result) {
	console.log('---- result ----');
	// console.log(result);
}).catch(function(then, error) {
	console.log('---- error ----');
	// console.error(error);
});

// Task.load(17, function(err, task) {
// 	// console.log('load', err, task);
// 	task.title = "g";
// 	task.save(function(err, task) {
// 		console.log('save', err, task);
// 		// console.log(err);
// 		// console.log(task);
// 	});
// });


// var t

// // Save
// var p = new Person();
// p.email = 'miwenjie@forgame.com';
// p.password = 'password';
// p.save(function(err) {
// 	console.log(err);
// });

// // // Load
// // Then(function(then) {
// // 	Person.load(4, then);
// // }).then(function(then, person) {
// // 	console.log(person);
// // });


// // // Find
// Then(function(then) {
// 	Person.find({}, then);
// }).then(function(then, persons) {
// 	console.log(persons);
// });

// // console.log(new Person);
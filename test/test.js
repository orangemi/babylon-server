var mysql = require('mysql');
var Then = require('thenjs');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

Task.load(17, function(err, task) {
	// console.log('load', err, task);
	task.title = "g";
	task.save(function(err, task) {
		console.log('save', err, task);
		// console.log(err);
		// console.log(task);
	});
});


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
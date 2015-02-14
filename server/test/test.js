var mysql = require('mysql');
var Then = require('thenjs');
var Person = require('../lib/Person');

// var t

// // Save
var p = new Person();
p.email = 'miwenjie@forgame.com';
p.password = 'password';
p.save(function(err) {
	console.log(err);
});

// // Load
// Then(function(then) {
// 	Person.load(4, then);
// }).then(function(then, person) {
// 	console.log(person);
// });


// // Find
Then(function(then) {
	Person.find({}, then);
}).then(function(then, persons) {
	console.log(persons);
});

// console.log(new Person);
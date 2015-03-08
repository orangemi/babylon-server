var mysql = require('mysql');
var Then = require('thenjs');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

var person;
var task;
// Then(function(then) {
// 	Task.load(2, then);
// }).then(function(then, result) {
// 	task = result;
// 	Person.load(3, then);
// }).then(function(then, result) {
// 	person = result;
// 	task.assignToPerson(person);
// });

Then(function(then) {
	Task.load(5, then);
}).then(function(then, result) {
	task = result;
	Task.load(3, then);
}).then(function(then, result) {
	task.assignToTask(result);
	// person = result;
	// task.assignToPerson(person);
});
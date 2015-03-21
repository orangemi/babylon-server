var mysql = require('mysql');
var Then = require('thenjs');
var User = require('../lib/User');
var Task = require('../lib/Task');

var user;
var task;
// Then(function(then) {
// 	Task.load(2, then);
// }).then(function(then, result) {
// 	task = result;
// 	User.load(3, then);
// }).then(function(then, result) {
// 	user = result;
// 	task.assignToUser(user);
// });

Then(function(then) {
	Task.load(5, then);
}).then(function(then, result) {
	task = result;
	Task.load(3, then);
}).then(function(then, result) {
	task.assignToTask(result);
	// user = result;
	// task.assignToUser(user);
});
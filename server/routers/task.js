var Then = require('thenjs');

var Session = require('../session');
var Router = require('../lib/Router');
var Person = require('../lib/Person');
var Task = require('../lib/Task');

var router = module.exports = new Router();

router.post(/\/task\/(\d+)?$/, function(req, res) {
	var id = req.path[2];
	var current_task;
	var current_person;
	// console.log(id, req);

	Then(function(then) {
		var personId = Session.get(req.cookie.session);
		Person.load(personId, then);
	}).then(function(then, person) {
		current_person = person;
		var task = new Task();
		task.creator = person.id;
		task.save(then);
	}).then(function(then, task) {
		current_task = task;
		task.assignTo(current_person, 1, then);
	}).then(function(then, task) {
		res.write(JSON.stringify(task.display()));
		then();
	}).finally(function() {
		res.end();
	});
});
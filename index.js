"use strict";

var fork = require("child_process").fork;
var callerPath = require("caller-path");

module.exports = function (args, options, closure) {
	if (args instanceof Function) {
		closure = args;
		args = [];
		options = {};
	} else if (options instanceof Function) {
		closure = options;
		if (args instanceof Array) {
			options = {};
		} else if (options instanceof Object) {
			options = args;
			args = [];
		} else {
			throw new TypeError("expecting options object");
		}
	} else if (!(args instanceof Array)) {
		throw new TypeError("expecting args array");
	} else if (!(options instanceof Object)) {
		throw new TypeError("expecting options object");
	} else if (!(closure instanceof Function)) {
		throw new TypeError("expecting closure function");
	}

	var child = fork(__dirname + "/lib/child.js", [], options);

	child.send({
		cmd: "FORKME_init",
		filename: callerPath(),
		closureSrc: closure.toString(),
		args: args
	});

	return child;
};
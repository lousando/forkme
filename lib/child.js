"use strict";

var fakeMain = require("./fake-main");

process.on("message", function onMessage(message) {
	if (message.cmd !== "FORKME_init") {
		return;
	}
	if (onMessage.initialized) {
		return;
	}

	// Should only be initialized once.
	onMessage.initialized = true;

	// Remove the message listener so that the process can exit normally.
	process.removeListener("message", onMessage);

	// Eval the closure source and make it think it's the main module.
	var value = fakeMain(message.filename, message.closureSrc, message.args);

	// If the closure returned a defined value, send it to the parent as an IPC
	// message.
	if (typeof value !== "undefined") {
		process.send(value);
	}
});
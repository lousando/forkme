"use strict";

var path = require("path");
var Module = require("module");
var wrapSource = require("./wrap-source");

Module.exports = function fakeMain(filename, closureSrc, args) {
	// Determine the file extension and save the existing extension handler.
	var ext = path.extname(filename) || ".js";
	var saved = require.extensions[ext];

	require.extensions[ext] = function (module, filename) {
		// Restore the saved extension handler.
		if (saved) {
			require.extensions[ext] = saved;
		} else {
			delete require.extensions[ext];
		}

		// The default .js handler would read the source file here. We already
		// have the source for our fake module, we just need to wrap it up so
		// that it clears the module cache and exports the reconstituted
		// closure.
		var src = wrapSource(closureSrc);

		module._compile(src, filename);
	};

	// Pretend to be the main module.
	process.argv[1] = filename;
	Module.runMain();

	var closure = process.mainModule.exports;

	return closure.apply(null, args);
};
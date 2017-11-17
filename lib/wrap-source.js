"use strict";

var path = require("path");

module.exports = function (closureSrc) {
	var clearCachePath = JSON.stringify(path.join(__dirname, "clear-cache.js"));

	return "require(" + clearCachePath + ");\nmodule.exports=(" + closureSrc + ");";
};

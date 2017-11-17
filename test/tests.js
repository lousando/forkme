var forkme = require("../index");
var expect = require("chai").expect;

describe("forkme", function () {
	"use strict";

	it("can run code inside another thread", function (done) {
		this.timeout(8000);

		var value = 5;

		var child = forkme([value], function (value) {
			return value * 2;
		});

		child.on("message", function (message) {
			expect(message).to.equal(10);
		});

		child.on("exit", function () {
			done();
		});
	});

	it("can take a while inside a thread", function (done) {
		this.timeout(15000);

		var child = forkme(function () {
			setTimeout(function () {
				// doing some work
			}, 8000);
		});

		child.on("exit", function () {
			done();
		});
	});

});
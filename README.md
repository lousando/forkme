# forkme

Spawn a process without a module

_(does NOT write any temporary files)_

## Installation

```bash
yarn add forkme
```

## Usage

```js
let forkme = require('forkme');
```

### Basic Use

```js
var child = forkme(function () {
    console.log("running in a child process!");
});
```

### Context

A fake copy of the calling module is created in the child process, so as much as
possible the closure should behave as if it's still in the module that called
`forkme()`.

One possible way in which the calling module and the closure module might
differ, is that the closure module will be the main module of the child process.

```js
forkme(function () {
	console.log(require.main === module); // true
});
```

#### `require` <br> `module.require`

Modules required from the closure should resolve the same way they would if they
had been required in the calling module.

Given:

* Calling module "/path/to/calling-module.js"
* Other module "/path/to/node_modules/foo/index.js"
* Other module "/path/to/bar.js"

Then:

```js
forkme(function () {
	console.log(require.resolve('foo')); // "/path/to/node_modules/foo/index.js"
	console.log(require.resolve('./bar')); // "/path/to/bar.js"
});
```

#### `__filename` <br> `__dirname` <br> `module.filename`

These variables have the same values in the closure as they did in the calling
module.

#### `module.id`

This will be "." because the closure is the main module of the child process.

### Arguments

An optional array of values can be passed as the first argument. The values will
be passed to the closure when it's called in the child process.

```js
forkme(['foo', 'bar'], function(a, b) {
    console.log(a + " " + b); // "foo bar"
});
```

All values in the arguments array must be JSON serializable.

### Options

Environment variables, working directory, input and output streams, etc., can
be modified by passing an options object. The options are passed directly to
`child_process.fork()`.

```js
var child = forkme({
    cwd: "/some/path",
    env: { foo: 'bar' },
    silent: true // Pipe stdin, stdout, and stderr to parent process.
}, function () {
    console.log(process.cwd() + ", " + process.env.foo);
});

child.stdout.setEncoding('utf8');
child.stdout.on('data', function (data) {
	process.stdout.write(data); // "/some/path, bar";
});
```

### Return

If the closure returns a defined value, an IPC message will be sent back to the
parent process with the returned value. The return value should be JSON
serializable.

```js
var child = forkme(function () {
	return 'foo';
});

child.on('message', function (message) {
	console.log(message); // "foo"
});
```

## API

### `forkme(closure)` <br> `forkme(args, closure)` <br> `forkme(options, closure)` <br> `forkme(args, options, closure)`

* `args` Array (optional)
* `options` Object (optional)
* `closure` Function
* __returns__ ChildProcess

Spawns a child process which calls the `closure`, passing it all values in the
`args` array.

The `options` argument is passed directly to `child_process.fork()`. See the
documentation for `child_process.fork()` for more information.

A standard Node.js ChildProcess instance is returned.
"use strict";

for (var filename in require.cache) {
	delete require.cache[filename];
}
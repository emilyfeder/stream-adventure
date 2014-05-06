var through = require('through');

function write(buf) {
	this.queue(buf.toString().toUpperCase());
}

process.stdin.pipe(through(write)).pipe(process.stdout);
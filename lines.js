var split = require('split');
var through = require('through');

var i = 0;
process.stdin
	.pipe(split())
	.pipe(through(function(line) {
		if(i%2==0) line = line.toString().toLowerCase();
		else line = line.toString().toUpperCase();
		this.queue(line + '\n');
		++i;
	}))
	.pipe(process.stdout);
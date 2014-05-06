var trumpet = require('trumpet');
var through = require('through');
var tr = trumpet();

process.stdin.pipe(tr);

var stream = tr.select('.loud').createStream();
stream.pipe(through(function write(buf) {
	this.queue(buf.toString().toUpperCase());
})).pipe(stream);

tr.pipe(process.stdout);
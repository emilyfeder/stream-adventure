var concat = require('concat-stream');
var through = require('through');

var write = concat(function(buffer){
	var res = buffer.toString().split("").reverse().join("");
	console.log(res);
});

process.stdin.pipe(write);


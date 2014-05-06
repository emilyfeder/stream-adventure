/*var duplexer = require('duplexer');
var through = require('through');

module.exports = function(counter) {
	var counts = {};
	counter.on('data', function(data) {
		if (data.country in counts) counts[data.country]++;
		else counts[data.country] = 1;
	});
	counter.on('end', function() {
		counter.setCounts(counts);
	});
	return duplexer(new stream.Writable(), counter);
};
	*/
//This was not well explained...
//Here's the official solution:

var duplexer = require('duplexer');
var through = require('through');

module.exports = function (counter) {
	var counts = {};
	var input = through(write, end);
	return duplexer(input, counter);

	function write (row) {
		counts[row.country] = (counts[row.country] || 0) + 1;
	}
	function end () { counter.setCounts(counts) }
};
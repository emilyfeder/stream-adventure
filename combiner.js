var combine = require('stream-combiner')
var split = require('split');
var through = require('through');
var zlib = require('zlib');


module.exports = function () {
	var genre;
	var write = function(data) {
		if (!data) return;
		data = JSON.parse(data);
		switch(data.type) {
			case 'genre' :
				if (genre) this.queue(JSON.stringify(genre) + '\n');
				genre = {'name': data.name, 'books':[]};
				break;
			case 'book' :
				genre.books.push(data.name);
				break;
			default:
		}
	};
	var end = function() {
		if (genre) this.queue(JSON.stringify(genre) + '\n');
		this.queue(null);
	}
	var gzip = zlib.createGzip();
	return combine(
		// read newline-separated json,
		// group books into genres,
		// then gzip the output
		split(),
		through(write, end),
		gzip
	)
}
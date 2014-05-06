var pipeline = require('stream-combiner');
var crypto = require('crypto');
var tar = require('tar');
var through = require('through');
var zlib = require('zlib');

//Readable/Writable Stream
var decipher = crypto.createDecipher(process.argv[2], process.argv[3]);

//Writable Stream only
var parser = tar.Parse();
parser.on('entry', function(e) {
	var write_file = function(data) {
		this.queue(data + ' ' + e.path + '\n');
	};
	if (e.type!='File') return;

	//Readable/Writable Stream
	var hasher = crypto.createHash('md5', {encoding: 'hex'});

	e.pipe(hasher).pipe(through(write_file)).pipe(process.stdout);
});
parser.on('error', function(err) {
	throw err;
});


pipeline(process.stdin, decipher, zlib.createGunzip(), parser);


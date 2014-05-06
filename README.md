stream-adventure
================

I work my way through the node-school lesson.
I had a lot of trouble with this, as I felt that each problem was explained in a confusing way.
Take this description from the duplexer problem:

    module.exports = function (counter) {
        // return a duplex stream to capture countries on the writable side
        // and pass through `counter` on the readable side
    };
    
What??? I had no idea what that meant. I found that this lesson in general evidently expected me to already know how streams work.
When it introduced a new stream module, it often didn't explain how to use these modules, and the documentation for them
didn't help much either. For example, here's the documentation for [tar](https://github.com/isaacs/node-tar). Take a look at
tar.Parse. What exactly is an entry object?

As another example, here's the node documentation for [zlib](http://nodejs.org/api/zlib.html#zlib_zlib_creategunzip_options). Apparently zlib.createGzip()
returns a Gzip object. So what's a gzip object? Well, apparently it compresses data using gzip. Well, thanks. That clarifies things immensely.

And often the examples they give aren't much more helpful. They might show you that an object emits a data event, like so:
    obj.on('data', function(data) {
      console.log(data);
    };
Ok, but logging to console doesn't really tell me what I can do with data. It doesn't tell me what kind of object it is and what kinds of methods it has.
I could go on and on (obviously), but let me get to some of the answers I've come to after struggling.

### What I learned

It was only after I read the [stream handbook](https://github.com/substack/stream-handbook), that things finally started to
make sense. Too bad this only happened before I did the last problem, which I finally solved with some sense of satisfaction
that I knew what I was doing.

Part of the issue is that streams are relatively abtract, what they really do is provide an interface with different functions and events depending on the type of stream, of which there are four (Readable, Writable, Transform, and Duplex). 
So any object that implements these functions can call itself a stream. It may have other methods as well.

You can often use pipe to string these streams together. You can pipe from a readable stream and into a writeable stream and bidirectionally for duplex (readable+writeable) streams.

So you can do this:

    readable.pipe(writeable);
    readable.pipe(duplex).pipe(writeable);
    
But not this:

    readable.pipe(readable2).pipe(writeable);
    readable.pipe(writeable).pipe(duplex);
    
The writeable stream has to be at the end of the pipe chain. Pipe also returns the last stream, which enables the chaining you see above.

The main differences between a readable and writeable stream is that a readable stream has the events 'data', and 'end' while a writeable stream doesn't. Instead, it has the functions .write() and .end(), which you use to write to it. It's confusing that the 'end' event is not the same as the .end() method.

    readable.on('data', function(data) {
        // What data is depends on what mode the stream is in. It could be an object, a buffer, or a string.
        // To determine the mode, look at the documentation for whatever readable stream you're using, although 
        // as we've determined, the documentation is often lacking.
    });
    readable.on('end', function() {
        //this event occurs when there is no more data to be sent.
    });
    
When you use a pipe, it will deal with these events. Again, use the documentation to learn what exactly the stream is doing to the data. For example, split() converts the data into a string and separates it by newlines, now the data passed into the next piped stream is chunked into lines.

For example:

    readable.pipe(split()).pipe(readable2);
    readable2.on('data', function(line) {
        //now each 'data' event will send the next line from the text passed from the readable stream.
        //line in this case is a buffer object, on which you can call toString() to turn it into a string
    });
    
Some core examples of write streams are process.stdout and a filestream for if you want to write to a file.
process.stdin in a read stream.

There are many types of stream modules you can use to do pre-built transformations on streams (like how split splits the data by newlines). You can also do your own transformations using the [through](https://github.com/dominictarr/through) module.
Basically, through creates a readable stream that hands you the data and allows you to transform it and send it along to the next stream to be read (or just log it or whatever you want to do with it).

    //data is whatever is read from process.stdin, which I believe is a buffer
    var write = function(data) {
        //here 'this' is scoped to the duplex stream, and we are writing the transformed data to be read again from
        //this stream.
        //We are transforming the string data into uppercase
        //Now whoever reads from this stream will get the uppercased version of the data.
        this.queue(data.toString().toUpperCase());
    };
    var end = function(data) {
        //the final thing written to this stream
        this.queue('some more data');
    };
    var duplex = process.stdin.pipe(through(write, end));
    duplex.pipe(process.stdout);

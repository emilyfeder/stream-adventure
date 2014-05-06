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
Or even the node documentation for [zlib](http://nodejs.org/api/zlib.html#zlib_zlib_creategunzip_options). Apparently zlib.createGzip()
returns a Gzip object. So what's a gzip object? Well, apparently it compresses data using gzip. Well, thanks. That clarifies things
immensely.
And often the examples aren't much more helpful. They might show you that an object emits a data event, like so:
    obj.on('data', function(data) {
      console.log(data);
    };
Ok, but logging to console, doesn't really tell me what I can do with data.
I could go on and on (obviously), but let me get to some of the answers I've come to after struggling.

What I learned
=====

It was only after I read the [stream handbook](https://github.com/substack/stream-handbook), that things finally started to
make sense. Too bad this only happened before I did the last problem, which I finally solved with some sense of satisfaction
that I knew what I was doing.

Part of the issue is that streams are relatively abtract, what they really do is provide an interface with different functions
and events depending on the type of stream, of which there are four (Readable, Writable, Transform, and Duplex). 
So any object that implements these functions can call itself a stream. It may have other methods as well.







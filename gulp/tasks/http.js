/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var gulp = require('gulp');
var http = require('http');
var ecstatic = require('ecstatic');

gulp.task('http', function(){
    http.createServer(
        ecstatic({ root: '.' })
    ).listen(9000);

//    console.log('Listening on :8080');
//    gulp.watch('**/*.js', function(){
//        gulp.run('your awesome task');
//    });
});
/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var gulp = require('gulp');
var http = require('http');
var connect = require('connect');

gulp.task('http', function(){

    var app = connect().use(connect.static('./test'));
    http.createServer(app).listen(9000);
});
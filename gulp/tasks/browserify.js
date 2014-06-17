/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify');
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('./src/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('ui-recorder.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('.'))
        .pipe(gulp.dest('./test/'));
});

var gulp = require('gulp');

gulp.task('copy', function() {
    return gulp.src('*.html')
        .pipe(gulp.dest('build'));
});
var gulp = require('gulp');

gulp.task('build', ['browserify', 'browserify-ext', 'browserify-ext-selector', 'browserify-css-selector']);

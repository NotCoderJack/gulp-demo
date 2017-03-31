var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');
var reload = browserSync.reload;
gulp.task('sass', function(){
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/static/css'))
        .pipe(reload({
            stream: true
        }))
});
gulp.task('browserSync', ['sass'], function(){
    browserSync.init({
        port: 8080,
        server: {
            baseDir: './app',
            index: 'htmls/index.html'
        }
    })
})
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/static/images'))
})
gulp.task('uglify-js', function(){
    return gulp.src('app/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/static/scripts'))
})

gulp.task('watch', ['browserSync'], function(){
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/htmls/**/*.html', reload);
    gulp.watch('app/scripts/**/*.js', reload);
});
gulp.task('clean', function(){
    return del.sync('dist');
})
gulp.task('run-sequence', function(cb){
    runSequence('clean', ['sass', 'images', 'uglify-js'],cb)
})
gulp.task('build', ['run-sequence'], function(cb){
})
gulp.task('serve', ['watch'], function(){
})

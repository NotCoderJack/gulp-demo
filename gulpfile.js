var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var del = require('del');
var minifyCss = require('gulp-minify-css')
var autoprefix = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var stripDebug = require('gulp-strip-debug');
var reload = browserSync.reload;
gulp.task('sass', function(){
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass())
        .pipe(autoprefix('last 2 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('app/css'))
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
        .pipe(uglify({compress:{drop_console:true}}))
        .pipe(gulp.dest('dist/static/scripts'))
})
gulp.task('minifyCss', function(){
    return gulp.src('app/css/**/*.css')
        pipe(minifyCss())
        pipe(gulp.dest('dist/static/css/**/*.css'))
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
gulp.task('bye-console',function(){
    return gulp.src('app/scripts/**/*.js')
        pipe(stripDebug())
        pipe(gulp.dest('dist'))
})

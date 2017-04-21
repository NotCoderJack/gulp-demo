'use strict'
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gulpZip = require('gulp-zip');
var gulpSftp =require('gulp-sftp');
var moment = require('moment');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var stripDebug = require('gulp-strip-debug');
const babel = require('gulp-babel');
var sloc = require('gulp-sloc');
var reload = browserSync.reload;
// 执行gulp task可以传入参数
var params = function(args) {
    // gulp param -src 'param here'
    var obj = {};
    for (let i = 0; i < args.length; i ++) {
        let key = args[i].substr(1);
        obj[key] = args[i+1];
        i++;
    }
    return obj;
}
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
});
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
    var src = params(process.argv.splice(3));
    console.log(src);
    return gulp.src(src.src)
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist/scripts'))
})
gulp.task('lines', function(){
    return gulp.src('app/scripts/**/*.js')
        .pipe(sloc())
})
gulp.task('babel', function(){
    return gulp.src('app/scripts/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/static/scripts'))
})
gulp.task('param', function(){
    console.log(process.argv);
    console.log(params(process.argv.splice(3)));
})

gulp.task('zip', function(){
    var timestamp = moment().format('YYYY-MM-DD_HH-MM-SS');
    var fileName = 'gulp-demo-' + timestamp + '.zip';
    console.log('gulp-demo/' + fileName)
    return gulp.src('./dist/**')
        .pipe(gulpZip(fileName))
        .pipe(gulp.dest('./dist'));
})
gulp.task('sftp', function(){
    return gulp.src('./dist/*.zip')
        .pipe(
            gulpSftp({
                host: '45.78.47.74',
                port: 27615,
                user: 'haojie',
                pass: 'haojie',
                remotePath: '/home/gulp-demo'
            })
        )
})
// 发布测试服务器
gulp.task('test', function(){
    return gulp.src('./dist/*.zip')
        .pipe(
            gulpSftp({
                host: '45.78.47.74',
                port: 27615,
                user: 'haojie',
                pass: 'haojie',
                remotePath: '/home/haojie/gulp-demo'
            })
        );
});

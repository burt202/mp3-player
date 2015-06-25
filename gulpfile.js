var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	jeditor = require('gulp-json-editor'),
	shell = require('gulp-shell'),
	jasmine = require('gulp-jasmine');

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    gulp.watch('public/css/**', ['compile-less']);
});

gulp.task('build', ['compile-less', 'bundle-js', 'type-production']);

gulp.task('unbuild', ['type-development']);

gulp.task('client-tests', function() {
	gulp.src('tests/**')
		.pipe(jasmine({
			verbose: true
		}));
});

gulp.task('jshint', function() {
	gulp.src([
			'public/js/**',
			'tests/**'
		])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compile-less', function() {
	gulp.src('public/css/imports.less')
		.pipe(less({
			paths: ['public/css/'],
			compress: true
		}))
		.pipe(rename('combined.css'))
		.pipe(gulp.dest('public/build/'));
});

gulp.task('type-production', function() {
	gulp.src('configs/app.json')
		.pipe(jeditor(function(json) {
			json.type = 'production';
			return json;
		}))
		.pipe(gulp.dest('configs/'));
});

gulp.task('type-development', function() {
	gulp.src('configs/app.json')
		.pipe(jeditor(function(json) {
			json.type = 'development';
			return json;
		}))
		.pipe(gulp.dest('configs/'));
});

gulp.task('bundle-js', shell.task([
    'node public/bower_components/rjs/dist/r.js -o public/build/build.json > public/build/build.js.log'
]));
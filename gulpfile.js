var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	jeditor = require('gulp-json-editor'),
	shell = require('gulp-shell'),
	jasmine = require('gulp-jasmine');

gulp.task('default', function() {
	gulp.watch('public/css/**', function() {
		gulp.run('compile-less');
	});
});

gulp.task('build', function () {
	gulp.run('bundle-js', 'type-production');
});

gulp.task('unbuild', function () {
	gulp.run('type-development');
});

gulp.task('jasmine', function() {
	gulp.src('tests/**')
		.pipe(jasmine({
			verbose: true
		}));
});

gulp.task('jshint', function() {
	gulp.src([
			'public/js/**',
			'tests/**',
			'!public/build/*.js',
			'!public/js/libs/**'
		])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compile-less', function() {
	gulp.src('public/css/imports.less')
		.pipe(less({
			paths: ['public/css/']
		}))
		.pipe(minifyCSS())
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
	'node public/build/r.js -o public/build/build.json'
]));
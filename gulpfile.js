var gulp = require("gulp")
  , sass = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  // , sourcemaps = require("gulp-sourcemaps")
  // , babel = require("gulp-babel")
  // , concat = require("gulp-concat")
  // , watch = require('gulp-watch')
  // , jasmine = require('gulp-jasmine')
  // , runSequence = require('run-sequence').use(gulp)

// gulp.task("babel", function () {
//   return gulp.src("src/**/*.js")
//     .pipe(sourcemaps.init())
//     .pipe(babel())
//     // .pipe(concat("index.js"))
//     .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest("dist"));
// });


// gulp.task('test', function() {
// 	return gulp.src('dist/specs/unit.js')
// 		.pipe(jasmine())
// })

gulp.task("default", ["js", "css"]);

// gulp.task("babel-watch", function() {
// 	runSequence('default');
// 	return watch('./src/**/*.js', function() {
// 		runSequence('default');
// 	})
// })

gulp.task('js', function() {
  return gulp.src('src/index.js')
    .pipe(uglify({
    	mangle: false
    }))
    .pipe(rename('nav-squisher.min.js'))
    .pipe(gulp.dest('dist/'));
});



var autoPrefixerBrowsers = [
    // Desktop
      'last 3 Chrome versions'
    , 'last 2 Firefox versions'
    , 'last 2 Safari versions'
    , 'last 2 Edge versions'
    , 'ie >= 9'
    // Mobile
    , 'last 3 ChromeAndroid versions'
    , 'last 3 Android versions'
    , 'last 3 FirefoxAndroid versions'
    , 'last 3 iOS versions'
    , 'last 2 ExplorerMobile versions'
    , 'last 2 OperaMobile versions'
    // Other
    , '> 2% in AU'
]

gulp.task('css', function() {

    return gulp.src("src/nav-squisher.scss")
      //.pipe(sourcemaps.init())
      .pipe(sass({ style: 'compressed' }))
        .on('error', function (err) {
            console.log('Sass error', err);
        })
        .pipe(autoprefixer({browsers: autoPrefixerBrowsers}))
        //.pipe(rename('freestyla.min.css'))
        .pipe(gulp.dest("dist/"))
})
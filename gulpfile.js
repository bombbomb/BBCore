const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const terser = require('gulp-terser'); // see here for minify options: https://github.com/terser/terser#minify-options
const package = require('./package.json');
const header = require('gulp-header');
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const path = require('path');

const paths = {
    src : 'src/**/*.js',
    build : 'build',
    outputFile : 'BBCore.min.js',
    karmaConfig : `${__dirname}/spec/karma.conf.js`,
    docSource : 'docs/build',
    root : './'
}

const filepathsToConcat = [
    'src/bbcore.js',
    'src/modules/bbcore.api.js',
    'src/modules/bbcore.auth.js',
    'src/modules/bbcore.contacts.js',
    'src/modules/bbcore.email.js',
    'src/modules/bbcore.extras.js',
    'src/modules/bbcore.helpers.js',
    'src/modules/bbcore.video.js',
    'src/modules/bbcore.videoRecorder.js'
];

const dateObject = new Date();
const today = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;
const coreHeader = `/*! ${package.name} ${today} */\n`
const docTitle = 'README.md';

gulp.task('combine-js', () => {
    return gulp.src(filepathsToConcat)
        .pipe(concat(paths.outputFile))
        .pipe(gulp.dest(paths.build));
});

gulp.task('make-docs', done => {
    const output = jsdoc2md.renderSync({ files: filepathsToConcat.map(filepath => path.join(__dirname, filepath)) });
    fs.writeFileSync(path.join(paths.docSource, 'BBCore.combined.md'), output);
    return done();
});

gulp.task('build', gulp.series('combine-js', 'make-docs'));


gulp.task('clean', done => {
    del([paths.build, paths.root + docTitle]);
    done();
});

gulp.task('compress', done => {
        gulp.src(`${paths.build}/${paths.outputFile}`)
        .pipe(terser())
        .pipe(gulp.dest(paths.build))
        done();
});

gulp.task('add-core-header', () => {
    return gulp.src(`${paths.build}/${paths.outputFile}`)
        .pipe(header(coreHeader))
        .pipe(gulp.dest(paths.build));
});

gulp.task('default', () => {
    console.log('Enter a task to perform an action.');
});

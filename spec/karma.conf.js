module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            '../src/libs/jquery.js',
            '../src/*.js',
            '*.js',
            { pattern: '../src/jquery.js', watched: false, included: true }
        ],
        reporters: ['dots'],
        browsers: ['PhantomJS']
    });
};
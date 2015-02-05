module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/jquery.js',
            'src/*.js',
            'spec/*.js',
            { pattern: 'src/jquery.js', watched: false, included: true }
        ],
        reporters: ['dots'],
        browsers: ['PhantomJS']
    });
};
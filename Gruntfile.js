module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        karma: {
            unit: {
                configFile: 'spec/karma.conf.js',
                singleRun: true
            }
        },
        jsdox: {
            generate: {
                options: {
                    contentsEnabled: false,
                    contentsTitle: 'API'
                },
                src: ['src/*.js'],
                dest: 'docs/'
            }
        },
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['docs/01_Intro.md', 'docs/02_Usage.md', 'docs/src/bbcore.md'],
                dest: 'README.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'karma', 'jsdox', 'concat']);
};
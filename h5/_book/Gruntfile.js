module.exports = function(grunt) {
    var srcJsDir = 'src/';
    var srcLessDir = 'src/';
    var buildDir = 'build/';
    var srcHtmlDir = 'src/html-controls';
    var tag = '1.6.5';
    require('time-grunt')(grunt);
  // configure grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            pc: {
                expand: true,
                cwd: 'src',
                options: {
                    debug: true,
                },
                src: [
                    'Sailer.js'
                ],
                dest: buildDir,
                ext: '.js'
            }
        },
        uglify: {
            production: {
                expand: true,
                cwd: buildDir,
                src: [
                    '**/*.js',
                    '!**/*.min.js'
                ],
                dest: buildDir,
                ext: '.min.js'
            },

        },
        watch: {
            options: {
                livereload: 3456
            },
            js: {
                files: [srcJsDir + '**/*.js'],
                tasks: ['browserify']
            }
        }
    });

    // Load plug-ins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // define tasks
    grunt.registerTask('default', [
        'browserify',
        'uglify'
    ]);
};

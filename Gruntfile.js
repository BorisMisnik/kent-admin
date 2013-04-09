module.exports = function(grunt) {

    var SRC_LESS = 'public/css/';
    var DEST_LESS = 'assets/css/';

    grunt.initConfig({
        less: {
            development: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'public/css/*.less',
                    dest: 'assets/css/',
                    ext: '.css'
                    //cwd: 'app/scripts'
                }]
            }

//            production: {
//                options: {
//                    paths: ["assets/css"],
//                    yuicompress: true
//                },
//                files: {
//                    "path/to/result.css": "path/to/source.less"
//                }
//            }
        }
            // todo: watch section
    });

    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.registerTask( 'default', [ 'less' ]);

};
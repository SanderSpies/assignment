module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      default: {
        src: [
          'components/*.js',
          'services/*.js'
        ],
        dest: 'build/development.js'
      }
    },
    sass: {
      dist: {
        files: {
          'build/development.css': 'components/PageComponent.scss'
        }
      }
    },
    watch: {
      files: [
        'components/*.js',
        'services/*.js',
        'components/*.scss'
      ],
      tasks: [
        'browserify',
        'sass'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['browserify']);
}
/* eslint-disable no-var, no-shadow, dot-notation */

module.exports = function(wallaby) {
  return {
    env: {
      kind: 'electron'
    },
    files: [

      {pattern: 'jspm_packages/system.src.js', instrument: false},
      {pattern: 'config.js', instrument: false},
      {pattern: 'jspm_packages/npm/babel-core@5.8.38/browser.min.js', load: true, instrument: false},
      {pattern: 'src/**/*.js', load: false}

    ],

    tests: [
      {pattern: 'test/unit/**/*.spec.js', load: false}
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel({
        presets: [ 'es2015-loose', 'stage-1'],
        plugins: [
          'syntax-flow',
          'transform-runtime',
          'transform-decorators-legacy',
          'transform-flow-strip-types'
        ]
      })
    },

    middleware: (app, express) => {
      app.use('/jspm_packages', express.static(require('path').join(__dirname, 'jspm_packages')));
    },

    bootstrap: function(wallaby) {
      var promises = [];
      var i = 0;
      var len = wallaby.tests.length;

      wallaby.delayStart();

      System.config({
        paths: {
          '*': '*.js'
        }
      });

      for (; i < len; i++) {
        promises.push(System['import'](wallaby.tests[i].replace(/\.js$/, '')));
      }
      System['import']('core-js')
      .then(function() {
        return Promise.all(promises);
      })
      .then(function() {
        wallaby.start();
      }).catch(function(e) { setTimeout(function() { throw e; }, 0); });
    },

    debug: true
  };
};

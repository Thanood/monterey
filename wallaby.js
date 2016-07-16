/* eslint-disable no-var, no-shadow, dot-notation */

module.exports = function(wallaby) {
  return {
    env: {
      kind: 'electron'
    },

    files: [

      {pattern: 'app/jspm_packages/system.src.js', instrument: false},
      {pattern: 'app/config.js', instrument: false},
      {pattern: 'app/jspm_packages/npm/babel-core@5.8.38/browser.min.js', load: true, instrument: false},
      {pattern: 'app/src/**/*.ts', load: false}

    ],

    tests: [
      {pattern: 'app/test/unit/**/*.spec.ts', load: false}
    ],

    middleware: (app, express) => {
      app.use('/jspm_packages', express.static(require('path').join(__dirname, 'app/jspm_packages')));
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

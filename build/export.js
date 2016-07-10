// this file provides a list of unbundled files that
// need to be included when exporting the application
// for production.
module.exports = {
  'list': [
    'app/index.html',
    'app/config.js',
    'app/index.js',
    'app/favicon.ico',
    'app/package.json',
    'app/images/**/*',
    'app/dist/**/*',
    'app/LICENSE',
    'app/jspm_packages/system.js',
    'app/jspm_packages/system-polyfills.js',
    'app/jspm_packages/system-csp-production.js',
    'app/jspm_packages/npm/jquery@*.js',
    'app/jspm_packages/npm/jquery@*/dist/jquery.js',
    'app/jspm_packages/github/monterey-framework/**/*',
    'app/styles/styles.css',
    'app/doc/CHANGELOG.md',
    'app/scripts/**/*',
    'app/node_modules/**/*.js',
    'app/node_modules/**/*.json',
    'app/scripts/babel-polyfill.min.js'
  ],
  // this section lists any jspm packages that have
  // unbundled resources that need to be exported.
  // these files are in versioned folders and thus
  // must be 'normalized' by jspm to get the proper
  // path.
  'normalize': [
    [
      // include font-awesome.css and its fonts files
      'font-awesome', [
        '/css/font-awesome.min.css',
        '/fonts/*'
      ]
    ], [
      // include bootstrap's font files
      'bootstrap', [
        '/fonts/*',
        '/css/*.css'
      ]
    ], [
      'jquery', [
        'dist/jquery.js'
      ]
    ]
  ]
};

var path = require('path');

exports.base = function() {
  return {
    filename: '',
    filenameRelative: '',
    sourceMap: false,
    sourceRoot: '',
    moduleRoot: path.resolve('src').replace(/\\/g, '/'),
    moduleIds: false,
    comments: false,
    compact: false,
    code: true,
    presets: [ 'es2015-loose', 'stage-1'],
    plugins: [
      // "syntax-async-functions",
      // "syntax-async-generators",
      // "transform-es2015-arrow-functions",
      "transform-async-to-generator",
      // 'transform-es2015-modules-systemjs',
      // 'syntax-flow',
      // 'transform-decorators-legacy',
      // 'transform-flow-strip-types'
    ]
  };
};
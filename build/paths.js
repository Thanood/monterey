var appRoot = 'app/src/';
var outputRoot = 'app/dist/';
var exportSrvRoot = 'export/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  styles: appRoot + 'styles/',
  css: appRoot + 'styles/**/*.css',
  less: appRoot + 'styles/styles.less',
  output: outputRoot,
  exportSrv: exportSrvRoot,
  doc: appRoot + 'doc',
  json: appRoot + '**/*.json'
};

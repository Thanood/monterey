var appRoot = 'app/';
var outputRoot = 'app/dist/';
var exportSrvRoot = 'app/export/';

module.exports = {
  root: appRoot,
  source: appRoot + 'src/**/*.ts',
  html: appRoot + 'src/**/*.html',
  styles: appRoot + 'styles/',
  css: appRoot + 'styles/**/*.css',
  less: appRoot + 'styles/styles.less',
  output: outputRoot,
  exportSrv: exportSrvRoot,
  doc: appRoot + 'doc',
  json: appRoot + '/src/**/*.json',
  dtsSrc: [
    './typings/**/*.d.ts',
    './custom_typings/**/*.d.ts'
  ]
};

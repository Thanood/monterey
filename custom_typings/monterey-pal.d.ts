declare module "monterey-pal" {
  export var FS;
  export var SESSION;
  export var JSPM;
  export var NPM;
  export var AURELIACLI;
  export var PROCESSES;
  export var OS;

  function initializePAL(cb: (fs?, session?, aureliaCLI?, processes?, npm?, jspm?, os?) => void)
}
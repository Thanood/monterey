declare module 'monterey-pal' {
  export const AURELIACLI: {
      create(model: any): void;
      install(model: any): void;
  };
  export const FS: {
      readFile(filePath: any): Promise<string>;
      fileExists(p: string): Promise<boolean>;
      folderExists(p: string): Promise<boolean>;
      showOpenDialog(config: any): Promise<string[]>;
      normalize(path: any): string;
      writeFile(path: any, content: any): void;
      getDirName(p: any): string;
      getFolderPath(p: any): string;
      join(...segments: any[]): string;
      getTempFile(): string;
      getRootDir(): string;
      unzip(zipPath, outPath): void;
      move(from, to): void;
      getTempFolder(): string;
      getDirectories(p: any): void;
      cleanupTemp(): void;
      downloadFile(url: any, targetPath: any): void;
      _downloadFile(stream: any, url: any, targetPath: any): void;
      createFolder(path: string): Promise<void>;
      access(p: string, flags): Promise<boolean>;
      readdir(p: string): Promise<Array<any>>;
      unlink(p: string): Promise<void>;
      stat(p: string): Promise<any>;
      mkdir(p: string): Promise<void>;
      appendFile(p: string, text: string): Promise<void>;
      getConstants(): any;
      getGlobalNodeModulesPath(): string;
  };
  export const SESSION: {
      get(key: any): void;
      set(key: any, value: any): void;
      clear(): void;
      has(key: any): void;
      getEnv(): string;
  };
  export const NPM: {
      install(packages: any, error: any): Promise<void>;
      load(npmOptions: any, error: any): void;
      ls(npmOptions: any): void;
      getConfig(setting: string): Promise<string>;
      setConfig(setting: string, value: string): Promise<void>;
  };
  export const JSPM: {
      install(packages: any, options: any): Promise<void>;
      downloadLoader(options: any): Promise<void>;
      getConfig(options: any): any;
      getForks(config: any, options: any): any;
  };
  export const OS: {
      getPlatform(): string;
      getNodeVersion(): string;
      getNPMVersion(): string;
      getChromeVersion(): string;
      getElectronVersion(): string;
      spawn(cmd: string, args: Array<string>, options, stdout: (data) => void, stderr: (data) => void): { process: any, completion: Promise<any> };
      exec(cmd: string, options): Promise<string>;
      kill(process: any): Promise<void>;
      getEnv(key?: string|Array<string>): any;
      openItem(path: string): any;
      processes: Array<any>;
  };

  export function initializePAL(callback: (fs, session, aureliacli, processes, npm, jspm, os, electron) => void): void;

  export const ELECTRON: {
    getIpcRenderer(): any;
    getxTerm(): any;
    getPty(): any;
    getPath(name: string): string;
    getGlobal(name: string): any;
  }
}

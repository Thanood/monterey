export interface Project {
  packageJSONPath?: string;
  name?: string;
  installNPM?: boolean;
  path: string;

  isUsingGulp?: boolean;
  gulpfile?: string;
}
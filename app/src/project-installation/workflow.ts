import {Step} from './step';
import {Phase} from './phase';

/**
 * The workflow class contains all information that is necessary to install a new project
 */
export class Workflow {
  // the post install workflow has several phases, and each phase consists of one or more steps
  // plugins decide what happens in each phase 

  // - install dependencies
  //   - npm install
  //   - jspm install
  // - setting up the environment
  //  - dotnet restore
  // - watch
  //   - gulp watch
  phases = {
    dependencies: new Phase('install dependencies'),
    environment: new Phase('setup environment'),
    run: new Phase('start the project')
  };
}


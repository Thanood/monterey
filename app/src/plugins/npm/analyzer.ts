import {autoinject} from 'aurelia-framework';
import {NPMAPI}     from '../../shared/npm-api';
import {FS, NPM}    from 'monterey-pal';
import * as semver  from 'semver';

@autoinject()
export class Analyzer {
  constructor(private npmAPI: NPMAPI) {
  }

  async analyze(project) {
    let packageJSON = JSON.parse(await FS.readFile(project.packageJSONPath));
    let deps = Object.assign({}, packageJSON.dependencies, packageJSON.devDependencies);
    let topLevelDependencies = [];

    // normalize data for the grid
    let keys = Object.keys(deps);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let dep = deps[key];

      topLevelDependencies.push({
        name: key,
        range: deps[key]
      });
    }

    return topLevelDependencies;
  }

  async lookupInstalledVersions(project, topLevelDependencies) {
    let tree: string = await NPM.ls({ workingDirectory: FS.getFolderPath(project.packageJSONPath) });
    let lines = tree.split('\n');
    let deps = [];
    // remove first line of tree (we already know what package it is)
    lines = lines.splice(1, lines.length);
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.replace('├── ', '');
      deps.push({
        name: line.split('@')[0],
        version: line.split('@')[1],
      });
    }

    deps.forEach(dep => {
      let tld = topLevelDependencies.find(x => x.name === dep.name);
      if (tld) {
        tld.version = dep.version;
      }
    });
  }

  getLatestVersions(dependencies) {
    dependencies.forEach(dep => {
      this.npmAPI.getLatest(dep.name)
      .then(version => dep.latest = version)
      .catch((e) => {});
    });
  }

  async checkIfUpToDate(m) {
    // can't determine whether a dep is out of date when
    // there is no version or latest version known
    if (!m.version || !m.latest) return;

    // not sure how to handle this yet
    // "typescript": ">=1.9.0-dev || ^2.0.0",
    if (m.version.indexOf('||') > -1) return;

    if (semver.lt(m.version, m.latest)) {
      m.isUpToDate = false;
    } else {
      m.isUpToDate = true;
    }
  }
}

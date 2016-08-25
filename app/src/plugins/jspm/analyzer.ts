import {autoinject} from 'aurelia-framework';
import {GithubAPI}  from '../../shared/github-api';
import {NPMAPI}     from '../../shared/npm-api';
import * as semver  from 'semver';

@autoinject()
export class Analyzer {

  loader;
  packageJSON;

  constructor(public githubAPI: GithubAPI,
              public npmAPI: NPMAPI) {}

  analyze(loader, packageJSON) {
    this.loader = loader;
    this.packageJSON = packageJSON;

    this.lookupRanges();

    return this.normalize();
  }

  // normalize all the data we got from JSPM
  // transform this data so it can be easier to display in a grid
  normalize() {
    let normalized = [];
    let baseMap = this.loader.baseMap;
    let depMap = this.loader.depMap;

    // the map of all dependencies (not just top level dependencies) does
    // not contain any information if it's also a top level dependency
    // more importantly, the semver range of the top level dependency
    // here we look that up through the map of top level dependencies
    let keys = Object.keys(baseMap);
    for (let i = 0; i < keys.length; i++) {
      let packageName = keys[i];
      let pkg = baseMap[packageName];

      pkg.isTopLevel = true;
      pkg.alias = keys[i];

      if (depMap[pkg.exactName]) {
        Object.assign(depMap[pkg.exactName], pkg);
      }
    }

    keys = Object.keys(depMap);
    for (let i = 0; i < keys.length; i++) {
      let m = depMap[keys[i]];

      m.isGithub = keys[i].startsWith('github:');
      m.isNPM = keys[i].startsWith('npm:');

      // make sure that every dependency map has a 'package' name
      if (!m.package) {
        if (keys[i].startsWith('github:')) {
          m.package = keys[i].replace('github:', '').split('@')[0];
        } else if (keys[i].startsWith('npm:')) {
          m.package = keys[i].replace('npm:', '').split('@')[0];
        }
      }

      normalized.push(depMap[keys[i]]);
    }

    // return an array of all dependencies
    return normalized;
  }

  lookupRanges() {
    let baseMap = this.loader.baseMap;

    let keys = Object.keys(baseMap);
    for (let i = 0; i < keys.length; i++) {
      let packageName = keys[i];
      let baseMapDep = baseMap[packageName];

      let packageJSONDep = this.packageJSON.jspm.dependencies[packageName];

      if (!packageJSONDep) {
        packageJSONDep = this.packageJSON.jspm.devDependencies[packageName];
      }

      if (packageJSONDep) {
        baseMapDep.range = this.extractRange(packageJSONDep);
      }
    }
  }

  async lookupLatest() {
    let promises = [];


    let depMap = this.loader.depMap;
    let keys = Object.keys(depMap);
    for (let i = 0; i < keys.length; i++) {
      let m = depMap[keys[i]];
      let promise;

      // use github api to get the latest version of github packages
      if (m.isGithub) {
        promise = this.githubAPI.getTags(m.package)
          .then(tags => {
            // some github repositories have no releases
            if (tags.length > 0) {
              tags = tags.map(i => i.name).sort(semver.compare);
              let tag = tags[tags.length - 1];
              if (tag) {
                m.latest = this.normalizeTag(tag);
              }
            } else {
              m.latest = 'no releases';
            }
          });
      } else if (m.isNPM) {
        // use npm api to get the latest version of npm packages
        promise = this.npmAPI.getLatest(m.package)
          .then(tag => {
            if (tag) {
              m.latest = this.normalizeTag(tag)
            }
          });
      }

      if (promise) {
          // as soon as we know what the latest version is, compare it with current
        promise = promise.then(() => this.checkIfUpToDate(m));
      } else {
        m.latest = 'unknown endpoint';
      }

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  // some tags on github have the "v" prefix, we don't want that
  normalizeTag(tag: string) {
    return tag.startsWith('v') ? tag.slice(1, tag.length) : tag;
  }

  async checkIfUpToDate(m) {
    if (semver.valid(m.version) && semver.valid(m.latest)) {
      if (m.latest === m.version) {
        m.isUpToDate = true;
      } else {
        m.isUpToDate = false;
      }
    }
  }

  extractRange(packageName) {
    // packageName could be github:systemjs/plugin-text@^0.0.8
    // we want the ^0.0.8 part
    return packageName.split('@')[1];
  }
}
import {AboutModal}            from '../../../../src/plugins/about/about-modal';
import {initializePAL, FS, OS} from 'monterey-pal';

describe('AboutModal', () => {
  let sut: AboutModal;
  let ea;

  beforeEach(() => {
    OS.getElectronVersion = () => '1.3.4';
    OS.getNodeVersion = () => '6.3.1';
    FS.join = (...args) => Array.prototype.slice.call(args).join('/');
    FS.readFile = async (path) => {
      if (path === 'c:/some/dir/package.json') {
        return '{ "version": "v0.2.4" }';
      }
    };
    FS.getRootDir = () => 'c:/some/dir';
    sut = new AboutModal(null);
  });

  it('gets monterey version from package.json', async (r) => {
    await sut.activate();
    expect(sut.montereyVersion).toBe('v0.2.4');
    r();
  });

  it('fetches electron and node version', async (r) => {
    await sut.activate();
    expect(sut.electronVersion).toBe('1.3.4');
    expect(sut.nodeJSVersion).toBe('6.3.1');
    r();
  });
});
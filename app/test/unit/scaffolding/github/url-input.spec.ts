// import {UrlInput} from '../../../../src/scaffolding/github/url-input';
// import {GithubAPI} from '../../../../src/shared/github-api';
// import {Container} from 'aurelia-framework';
// import {ValidationController} from 'aurelia-validation';

// describe('url-input scaffolding', () => {
//   let sut: UrlInput;

//   beforeEach(() => {
//     let container = new Container();
//     container.registerInstance(ValidationController, { validate: () => [] });
//     container.registerInstance(GithubAPI, { getContents: async () => { return { status: 404 }; } });

//     sut = container.get(UrlInput);
//     sut.state = {
//       github: {}
//     };
//   });

//   it('gets slug from github url', () => {
//     sut.repo = 'https://github.com/aurelia-ui-toolkits/cm-bridges';
//     sut.repoChanged();
//     expect(sut.slug).toBe('aurelia-ui-toolkits/cm-bridges');

//     sut.slug = '';
//     sut.repo = 'https://github.com/aurelia-ui-toolkits/cm-bridges.git';
//     sut.repoChanged();
//     expect(sut.slug).toBe('aurelia-ui-toolkits/cm-bridges');


//     sut.slug = 'test';
//     sut.repo = 'https://google.com';
//     sut.repoChanged();
//     expect(sut.slug).toBe('');
//     expect(sut.error).toBe('Incorrect github url. Format: https://github.com/some-username/some-repository');

//     sut.slug = 'test';
//     sut.repo = 'https://github.com/aurelia-ui-toolkits';
//     sut.repoChanged();
//     expect(sut.slug).toBe('');
//     expect(sut.error).toBe('Incorrect github url. Format: https://github.com/some-username/some-repository');

//     sut.slug = 'test';
//     sut.repo = 'https://github.com/aurelia-ui-toolkits/cm-bridges/master/branch/file.png';
//     sut.repoChanged();
//     expect(sut.slug).toBe('');
//     expect(sut.error).toBe('Incorrect github url. Format: https://github.com/some-username/some-repository');
//   });

//   it ('gets project name from slug (or subfolder)', async (d) => {
//     sut.slug = 'aurelia-ui-toolkits/cm-bridges';
//     sut.state.github.subfolder = null;
//     await sut.execute();
//     expect(sut.state.name).toBe('cm-bridges');


//     sut.slug = '';
//     sut.state.github.subfolder = 'original';
//     await sut.execute();
//     expect(sut.state.name).toBe('original');

//     d();
//   });
// });
<a name="0.4.7"></a>
## [0.4.7](https://github.com/monterey-framework/monterey/compare/v0.4.6...v0.4.7) (2016-10-09)



<a name="0.4.6"></a>
## [0.4.6](https://github.com/monterey-framework/monterey/compare/v0.4.5...v0.4.6) (2016-10-07)


### Bug Fixes

* **electron:** lock down version of electron ([3968a8f](https://github.com/monterey-framework/monterey/commit/3968a8f))

<a name="0.4.5"></a>
## [0.4.5](https://github.com/monterey-framework/monterey/compare/v0.4.4...v0.4.5) (2016-10-06)


### Bug Fixes

* **file-system-logger:** fixed tests, resolved issue with the 9th month ([531e87a](https://github.com/monterey-framework/monterey/commit/531e87a))
* **jspm:** some jspm message are null ([b893c8e](https://github.com/monterey-framework/monterey/commit/b893c8e))
* **task-manager-modal:** translate task-cannot-be-stopped message ([1d5055f](https://github.com/monterey-framework/monterey/commit/1d5055f))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/monterey-framework/monterey/compare/v0.4.3...v0.4.4) (2016-09-28)


### Bug Fixes

* **gist-run:** use window.open to open gistrun so that it works on mac ([0f6b5af](https://github.com/monterey-framework/monterey/commit/0f6b5af))


### Features

* **all:** removed placeholder screens for dotnet/gulp/typings/aurelia-cli/webpack ([66a68fa](https://github.com/monterey-framework/monterey/commit/66a68fa))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/monterey-framework/monterey/compare/v0.4.2...v0.4.3) (2016-09-24)


### Bug Fixes

* **error-modal:** detach clipboardjs event handlers ([f0d543f](https://github.com/monterey-framework/monterey/commit/f0d543f))


### Features

* **task-manager:** stop all tasks when parent task fails ([2b592ac](https://github.com/monterey-framework/monterey/commit/2b592ac))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/monterey-framework/monterey/compare/v0.4.1...v0.4.2) (2016-09-23)


### Bug Fixes

* **logging:** log to txt and not to csv ([dd01449](https://github.com/monterey-framework/monterey/commit/dd01449))
* **styling:** highlight selected item in a list more ([1d98606](https://github.com/monterey-framework/monterey/commit/1d98606))


### Features

* **aurelia-cli:** explain how to install aurelia-cli ([6ee4d85](https://github.com/monterey-framework/monterey/commit/6ee4d85))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/monterey-framework/monterey/compare/v0.4.0...v0.4.1) (2016-09-22)


### Bug Fixes

* **aurelia-cli:** do not offer to run "au run --watch" when aurelia-cli is not installed ([1f056d5](https://github.com/monterey-framework/monterey/commit/1f056d5))
* **exit-procedure:** reload window after killing processes when in development ([184e64e](https://github.com/monterey-framework/monterey/commit/184e64e))
* **workflow:** show taskmanager when starting workflow ([c0a18d7](https://github.com/monterey-framework/monterey/commit/c0a18d7))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/monterey-framework/monterey/compare/v0.3.2...v0.4.0) (2016-09-21)


### Bug Fixes

* **task-manager:** update taskmanager toolbar text on attached ([74e3e52](https://github.com/monterey-framework/monterey/commit/74e3e52))
* **task-manager:** when task gets added to taskManager, finished must be reset to false ([3256b3d](https://github.com/monterey-framework/monterey/commit/3256b3d))
* **tour:** intro.js should wait for dialog to be closed before starting intro.js ([053f6da](https://github.com/monterey-framework/monterey/commit/053f6da))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/monterey-framework/monterey/compare/v0.3.1...v0.3.2) (2016-09-10)


### Bug Fixes

* **project-list:** disable up and down key for project list ([345b0ce](https://github.com/monterey-framework/monterey/commit/345b0ce))


### Features

* **intro:** added intro.js ([3c9a7a8](https://github.com/monterey-framework/monterey/commit/3c9a7a8))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/monterey-framework/monterey/compare/v0.3.0...v0.3.1) (2016-09-02)


### Bug Fixes

* **auto-update:** resolved issue with mac auto updating ([f6a26da](https://github.com/monterey-framework/monterey/commit/f6a26da))
* **task-manager:** don't if.bind the task-runner ([e41952c](https://github.com/monterey-framework/monterey/commit/e41952c))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/monterey-framework/monterey/compare/v0.2.4...v0.3.0) (2016-09-02)


### Bug Fixes

* **deps:** resolved fork ([f922a8c](https://github.com/monterey-framework/monterey/commit/f922a8c)), closes [/github.com/monterey-framework/monterey/issues/265#issuecomment-244429753](https://github.com//github.com/monterey-framework/monterey/issues/265/issues/issuecomment-244429753)
* **gulp:** fail nicely when gulp watch does not exist ([298214b](https://github.com/monterey-framework/monterey/commit/298214b))
* **jspm:** resolve variables in output messages during jspm install ([68f7b20](https://github.com/monterey-framework/monterey/commit/68f7b20))
* **linux:** resolved linux issues ([5fd9791](https://github.com/monterey-framework/monterey/commit/5fd9791))
* **logger:** take into account that the buffer may change during longer during flush ([2d58198](https://github.com/monterey-framework/monterey/commit/2d58198))
* **main:** left menu did not close when tile screen was active ([9022c2e](https://github.com/monterey-framework/monterey/commit/9022c2e))
* **npm:** install npm dependencies via command line ([f314be5](https://github.com/monterey-framework/monterey/commit/f314be5))
* **project-list:** added splitter ([ce67e25](https://github.com/monterey-framework/monterey/commit/ce67e25))
* **project-list:** always show scrollbar ([82169d8](https://github.com/monterey-framework/monterey/commit/82169d8))
* **project-list:** select correct project on context menu ([b51ab9f](https://github.com/monterey-framework/monterey/commit/b51ab9f))
* **scaffolding:** filter out duplicate actions ([084cff4](https://github.com/monterey-framework/monterey/commit/084cff4))
* **scaffolding:** include aurelia-cli's post installation tasks ([32d980c](https://github.com/monterey-framework/monterey/commit/32d980c))
* **scaffolding:** renamed zip to github ([dcbd4a2](https://github.com/monterey-framework/monterey/commit/dcbd4a2))
* **scaffolding:** resolve issue where validation did not apply after switching project template ([d9d3164](https://github.com/monterey-framework/monterey/commit/d9d3164))
* **scaffolding:** resolved command is undefined error ([2fa9d28](https://github.com/monterey-framework/monterey/commit/2fa9d28))
* **scaffolding:** store folder path, not project path ([d8d9f6b](https://github.com/monterey-framework/monterey/commit/d8d9f6b))
* **scaffolding:** take first path of directory browser ([785b97a](https://github.com/monterey-framework/monterey/commit/785b97a))
* **startup:** use existence of session to decide whether to go to landing page or not ([4896068](https://github.com/monterey-framework/monterey/commit/4896068))
* **task-manager:** enable auto-scroll based on the finished flag of the task ([b266fcf](https://github.com/monterey-framework/monterey/commit/b266fcf))
* **task-manager:** ending of task should end dependent tasks ([610e50d](https://github.com/monterey-framework/monterey/commit/610e50d))
* **task-manager:** finished task may not have started ([730009c](https://github.com/monterey-framework/monterey/commit/730009c))
* **task-manager:** some tasks finish in 0 seconds ([2eaed62](https://github.com/monterey-framework/monterey/commit/2eaed62))
* **task-manager:** typo ([f2cda8b](https://github.com/monterey-framework/monterey/commit/f2cda8b))
* **task-runner:** handle case where user switches projects before loading has finished ([41f08c2](https://github.com/monterey-framework/monterey/commit/41f08c2))
* **webpack:** webpack is started with "npm start" not "npm run" ([78e358e](https://github.com/monterey-framework/monterey/commit/78e358e))


### Features

* **dotnet:** initial dotnet plugin implementation ([8a4d408](https://github.com/monterey-framework/monterey/commit/8a4d408))
* **electron:** restore window state ([7b3ac63](https://github.com/monterey-framework/monterey/commit/7b3ac63))
* **errors:** allow removal of errors ([f636714](https://github.com/monterey-framework/monterey/commit/f636714))
* **jspm:** use globally installed jspm if the local one is not installed ([062c528](https://github.com/monterey-framework/monterey/commit/062c528))
* **layout:** initial splitter work ([3237db5](https://github.com/monterey-framework/monterey/commit/3237db5))
* **logger:** disable removal of old log files ([8d50514](https://github.com/monterey-framework/monterey/commit/8d50514))
* **project-finder:** allow user to add multiple projects to monterey by selecting multiple directories ([c26d7f7](https://github.com/monterey-framework/monterey/commit/c26d7f7))
* **projects:** allow renaming of projects ([95d16bc](https://github.com/monterey-framework/monterey/commit/95d16bc))
* **scaffolding:** store default project directory in session ([a145f17](https://github.com/monterey-framework/monterey/commit/a145f17))
* **typings:** support typings ([0fbd072](https://github.com/monterey-framework/monterey/commit/0fbd072))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/monterey-framework/monterey/compare/v0.2.3...v0.2.4) (2016-08-25)


### Bug Fixes

* **all:** store logs/app launcher images in appdata ([6daf597](https://github.com/monterey-framework/monterey/commit/6daf597))
* **main:** do not display right side of the screen without a selected project ([e45d101](https://github.com/monterey-framework/monterey/commit/e45d101))
* **main:** pass correct project to tile screens ([76a5da5](https://github.com/monterey-framework/monterey/commit/76a5da5))
* **npm:** name in package.json is bound to rules ([86a92b5](https://github.com/monterey-framework/monterey/commit/86a92b5))
* **project-manager:** resolved error "warning is not a function" ([60d640d](https://github.com/monterey-framework/monterey/commit/60d640d))
* **scaffolding:** increase size of options in scaffolding screen ([484467e](https://github.com/monterey-framework/monterey/commit/484467e))
* **selected-project:** handle null project when saving selected project to state ([f4f8a7d](https://github.com/monterey-framework/monterey/commit/f4f8a7d))
* **task-manager:** ignore empty gulp messages ([e980a33](https://github.com/monterey-framework/monterey/commit/e980a33))
* **task-manager:** one log message may be two log messages but split by newline ([8f087b8](https://github.com/monterey-framework/monterey/commit/8f087b8))
* **task-runner:** don't use selectedProject but the project that's supplied ([2edef5f](https://github.com/monterey-framework/monterey/commit/2edef5f))


### Features

* **all:** added initial context menu implementation ([6cb5580](https://github.com/monterey-framework/monterey/commit/6cb5580))
* **app-launcher:** add chrome launcher by default and detect project url ([dff79f2](https://github.com/monterey-framework/monterey/commit/dff79f2))
* **monterey:** cleanup running child processes on quit ([7374340](https://github.com/monterey-framework/monterey/commit/7374340))
* **projects:** support projects without npm (with no package.json) ([a1c86cc](https://github.com/monterey-framework/monterey/commit/a1c86cc))
* **t-rex:** added t-rex game to taskmanager ([cc693bf](https://github.com/monterey-framework/monterey/commit/cc693bf))
* **task-manager:** show url project is running under ([92e6c11](https://github.com/monterey-framework/monterey/commit/92e6c11))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/monterey-framework/monterey/compare/v0.2.2...v0.2.3) (2016-08-16)


### Bug Fixes

* **error-modal:** show error message in addition to the stacktrace ([9672565](https://github.com/monterey-framework/monterey/commit/9672565))
* **github:** made github credential modal smaller ([1e0ae05](https://github.com/monterey-framework/monterey/commit/1e0ae05))
* **gulp:** handle situation where gulp is not installed ([ddd13d8](https://github.com/monterey-framework/monterey/commit/ddd13d8))
* **gulp:** look in more directories for gulpfile ([f27b8db](https://github.com/monterey-framework/monterey/commit/f27b8db))
* **gulp:** use folder path of package.json ([ef40ebe](https://github.com/monterey-framework/monterey/commit/ef40ebe))
* **jspm:** fixed install button ([6640ba9](https://github.com/monterey-framework/monterey/commit/6640ba9))
* **logos:** updated aurelia logo ([ae190a2](https://github.com/monterey-framework/monterey/commit/ae190a2))
* **scaffolding:** always clean up temp files ([5346f7b](https://github.com/monterey-framework/monterey/commit/5346f7b))
* **scaffolding:** automatically move on to the last screen after creating project ([a18ffb1](https://github.com/monterey-framework/monterey/commit/a18ffb1))
* **scaffolding:** don't use canDeactivate for close button ([16f4235](https://github.com/monterey-framework/monterey/commit/16f4235))
* **support:** second tab did not work ([17fd472](https://github.com/monterey-framework/monterey/commit/17fd472))


### Features

* **about:** about modal ([b376edb](https://github.com/monterey-framework/monterey/commit/b376edb))
* **app-launcher:** allow configuration of global and project-specific app launchers ([587f1b5](https://github.com/monterey-framework/monterey/commit/587f1b5))
* **aurelia-cli:** aurelia cli task runner ([c1efeba](https://github.com/monterey-framework/monterey/commit/c1efeba))
* **aurelia-cli:** detect aurelia-cli ([fa8cae4](https://github.com/monterey-framework/monterey/commit/fa8cae4))
* **gulp:** added gulp detection ([d330997](https://github.com/monterey-framework/monterey/commit/d330997))
* **gulp:** added gulp popover screen ([cb2f96a](https://github.com/monterey-framework/monterey/commit/cb2f96a))
* **gulp:** finished gulp implementation ([894eb88](https://github.com/monterey-framework/monterey/commit/894eb88))
* **logger:** delete log after x days ([6976043](https://github.com/monterey-framework/monterey/commit/6976043))
* **menu:** added menu items for copy/paste ([c8901e0](https://github.com/monterey-framework/monterey/commit/c8901e0))
* **preferences:** allow npm settings to be changed in preferences screen ([fb109c4](https://github.com/monterey-framework/monterey/commit/fb109c4))
* **scaffolding:** changed UI ([d510d29](https://github.com/monterey-framework/monterey/commit/d510d29))
* **scaffolding:** execute actions after project has been created ([f6bcc4a](https://github.com/monterey-framework/monterey/commit/f6bcc4a))
* **scaffolding:** execute multiple actions after project has been created ([1616172](https://github.com/monterey-framework/monterey/commit/1616172))
* **support:** support modal ([66a7dcf](https://github.com/monterey-framework/monterey/commit/66a7dcf))
* **tiles:** draggable tiles ([f8ae37a](https://github.com/monterey-framework/monterey/commit/f8ae37a))
* **updater:** auto update ([1afb781](https://github.com/monterey-framework/monterey/commit/1afb781))
* **webpack:** added webpack detection ([0fb078e](https://github.com/monterey-framework/monterey/commit/0fb078e))
* **webpack:** webpack task runner ([351edbf](https://github.com/monterey-framework/monterey/commit/351edbf))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/monterey-framework/monterey/compare/v0.2.0...v0.2.1) (2016-07-28)


### Bug Fixes

* **all:** global exception handlers ([a981c5e](https://github.com/monterey-framework/monterey/commit/a981c5e))
* **jspm:** jspm install task should finish after dlloader ([9699f8b](https://github.com/monterey-framework/monterey/commit/9699f8b))
* **npm:** handle install errors/warnings better ([c87f482](https://github.com/monterey-framework/monterey/commit/c87f482))
* **project-list:** select first project on startup and after removal of project ([9e75440](https://github.com/monterey-framework/monterey/commit/9e75440))
* **project-list:** select project after creation ([e9ec03c](https://github.com/monterey-framework/monterey/commit/e9ec03c))
* **tiles:** don't show "show irrelevant tiles" without project ([d7948db](https://github.com/monterey-framework/monterey/commit/d7948db))


### Features

* **all:** errors in taskbar ([ee0a121](https://github.com/monterey-framework/monterey/commit/ee0a121))
* **mac:** mac tiles ([56c967c](https://github.com/monterey-framework/monterey/commit/56c967c))
* **npm:** show output of npm install ([3808804](https://github.com/monterey-framework/monterey/commit/3808804))
* **scaffolding:** check for project folder existence ([eb3f115](https://github.com/monterey-framework/monterey/commit/eb3f115))
* **scaffolding:** use skeleton name as project name ([4e80f66](https://github.com/monterey-framework/monterey/commit/4e80f66))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/monterey-framework/monterey/compare/v0.1.5...v0.2.0) (2016-07-27)


### Bug Fixes

* **all:** fixed a couple of small issues ([af4503e](https://github.com/monterey-framework/monterey/commit/af4503e))
* **gistrun:** resolves issue where monterey crashes ([f52292f](https://github.com/monterey-framework/monterey/commit/f52292f))
* **github:** removed markdown reference ([e2dd5b8](https://github.com/monterey-framework/monterey/commit/e2dd5b8))
* **jspm:** ask for credentials once, then present user with error ([be4e20b](https://github.com/monterey-framework/monterey/commit/be4e20b))
* **jspm:** some github repositories have no releases ([1c89372](https://github.com/monterey-framework/monterey/commit/1c89372))
* **jspm:** use jspm of project ([1ba72ca](https://github.com/monterey-framework/monterey/commit/1ba72ca))
* **project-info:** unregister clipboard when detaching ([145adfe](https://github.com/monterey-framework/monterey/commit/145adfe))


### Features

* **all:** make better use of taskbar ([c223cba](https://github.com/monterey-framework/monterey/commit/c223cba))
* **app-launcher:** add app launcher remote install from monterey registry ([5197c94](https://github.com/monterey-framework/monterey/commit/5197c94))
* **config:** added endpoint management ([c5f37f0](https://github.com/monterey-framework/monterey/commit/c5f37f0))
* **deployment:** auto update ([10f0be5](https://github.com/monterey-framework/monterey/commit/10f0be5))
* **icons:** updated icons ([9c3c77c](https://github.com/monterey-framework/monterey/commit/9c3c77c))
* **project-info:** added more environment info and export to markdown ([03dfdf0](https://github.com/monterey-framework/monterey/commit/03dfdf0))
* **projects:** check if projects exists on startup ([f789f12](https://github.com/monterey-framework/monterey/commit/f789f12))
* **support:** added support tile ([0843126](https://github.com/monterey-framework/monterey/commit/0843126))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/monterey-framework/monterey/compare/v0.1.4...v0.1.5) (2016-07-14)


### Bug Fixes

* **gistrun:** fix GistRun tile crash on some machines ([4a9b9cf](https://github.com/monterey-framework/monterey/commit/4a9b9cf))


### Features

* **tiles:** wrap tile execution in handler ([2376dde](https://github.com/monterey-framework/monterey/commit/2376dde))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/monterey-framework/monterey/compare/0.1.3...v0.1.4) (2016-07-12)


### Bug Fixes

* **package.json:** added missing devDependencies ([3b84cc7](https://github.com/monterey-framework/monterey/commit/3b84cc7))
* **scaffolding:** removed garbage ([aa71998](https://github.com/monterey-framework/monterey/commit/aa71998))


### Features

* **app-launcher:** added sourcetree ([36ec338](https://github.com/monterey-framework/monterey/commit/36ec338))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/monterey-framework/monterey/compare/0.1.2...0.1.3) (2016-07-11)


### Bug Fixes

* **deployment:** deploy all node_modules files, fixes error when scaffolding aurelia-cli project ([cdf0df9](https://github.com/monterey-framework/monterey/commit/cdf0df9))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/monterey-framework/monterey/compare/0.1.1...0.1.2) (2016-07-11)


### Bug Fixes

* **deployment:** deploy using electron 1.2.6 ([dcd19a3](https://github.com/monterey-framework/monterey/commit/dcd19a3))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/monterey-framework/monterey/compare/0.1.0...0.1.1) (2016-07-10)


### Bug Fixes

* **scaffolding:** export .json files of node_modules, fixes .next() of undefined error ([84f6ffc](https://github.com/monterey-framework/monterey/commit/84f6ffc))


### Features

* **all:** added electron-debug to make debugging possible after deployment ([3f45469](https://github.com/monterey-framework/monterey/commit/3f45469))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/monterey-framework/monterey/compare/0.0.1...0.1.0) (2016-07-10)


### Bug Fixes

* **all:** normalize paths through PAL ([d88e974](https://github.com/monterey-framework/monterey/commit/d88e974))
* **jspm:** added "update all" button, fixed error in jspm install button ([9cafb63](https://github.com/monterey-framework/monterey/commit/9cafb63))
* **jspm:** call jspm correctly when updating multiple dependencies ([cd71e8a](https://github.com/monterey-framework/monterey/commit/cd71e8a))
* **jspm:** detect jspm when clicking on irrelevant jspm tile ([c8c92d6](https://github.com/monterey-framework/monterey/commit/c8c92d6))
* **jspm:** fixed issue where grid goes over row with buttons when forks warning is showed ([5fb647c](https://github.com/monterey-framework/monterey/commit/5fb647c))
* **jspm:** use requireTaskPool and show task manager modal immediately ([5930022](https://github.com/monterey-framework/monterey/commit/5930022))
* **npm:** use json npm ls output ([1102174](https://github.com/monterey-framework/monterey/commit/1102174))
* **scaffolding:** don't show previous button on first page ([7d59531](https://github.com/monterey-framework/monterey/commit/7d59531))
* **session:** updated session to localstorage ([0da1885](https://github.com/monterey-framework/monterey/commit/0da1885))
* **task-manager:** improve layout ([cb25a50](https://github.com/monterey-framework/monterey/commit/cb25a50))
* **wizard:** improved error handling ([d25d51d](https://github.com/monterey-framework/monterey/commit/d25d51d))


### Features

* **app-launcher:** add IDE app launchers ([7992a7a](https://github.com/monterey-framework/monterey/commit/7992a7a))
* **app-launcher:** added description to default app launchers ([6431dec](https://github.com/monterey-framework/monterey/commit/6431dec))
* **app-launcher:** enable/disable app launchers + added cmder launcher. ([aaac27f](https://github.com/monterey-framework/monterey/commit/aaac27f))
* **gistrun:** added gistrun tile ([6f70307](https://github.com/monterey-framework/monterey/commit/6f70307))
* **github:** allow for user to configure github creds to remove rate limitation ([a621a35](https://github.com/monterey-framework/monterey/commit/a621a35))
* **jspm:** dependency list ([5f31590](https://github.com/monterey-framework/monterey/commit/5f31590))
* **jspm:** package dependency list ([a158761](https://github.com/monterey-framework/monterey/commit/a158761))
* **JSPM:** fork detection ([1123fb3](https://github.com/monterey-framework/monterey/commit/1123fb3))
* **npm:** initial npm package manager screen work ([d4be2d0](https://github.com/monterey-framework/monterey/commit/d4be2d0))
* **npm:** npm install feature ([ac46b95](https://github.com/monterey-framework/monterey/commit/ac46b95))
* **npm:** npm package manager screen ([7d37fcc](https://github.com/monterey-framework/monterey/commit/7d37fcc))
* **preferences:** initial preferences screen ([9c3fb7e](https://github.com/monterey-framework/monterey/commit/9c3fb7e))
* **project-info:** allow plugins to supply information for the project-info screen ([9c1083a](https://github.com/monterey-framework/monterey/commit/9c1083a))
* **project-info:** copy project information to clipboard ([04bb78b](https://github.com/monterey-framework/monterey/commit/04bb78b))
* **scaffolding:** allow user to immediately install npm packages ([44dc9cc](https://github.com/monterey-framework/monterey/commit/44dc9cc))
* **scaffolding:** persist project name in package.json ([4e78cd9](https://github.com/monterey-framework/monterey/commit/4e78cd9))
* **taskmanager:** added tile for task manager ([07b60a0](https://github.com/monterey-framework/monterey/commit/07b60a0))
* **update-checker:** added update checker to notify user of update ([4f1b6fb](https://github.com/monterey-framework/monterey/commit/4f1b6fb))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/monterey-framework/monterey/compare/a6ebc2b...0.0.1) (2016-07-06)


### Bug Fixes

* **deps:** point to real monterey-pal ([b179268](https://github.com/monterey-framework/monterey/commit/b179268))
* **jspm:** check minor version for 0.17 ([66a5433](https://github.com/monterey-framework/monterey/commit/66a5433))
* **jspm:** fix reading version, also save definition in project ([70f1876](https://github.com/monterey-framework/monterey/commit/70f1876))
* **jspm:** typo in condition ([0071b4e](https://github.com/monterey-framework/monterey/commit/0071b4e))
* **layout:** fixed left column width ([7f168e0](https://github.com/monterey-framework/monterey/commit/7f168e0))
* **main:** select first project after removing a project, don't warn if no project has been selected ([832ca0e](https://github.com/monterey-framework/monterey/commit/832ca0e))
* **scaffolding:** use github release api to get latest skeleton-navigation ([dff62d8](https://github.com/monterey-framework/monterey/commit/dff62d8))
* **scaffolding:** use radio buttons instead of combobox ([9cb11d3](https://github.com/monterey-framework/monterey/commit/9cb11d3))
* **taskmanager:** finished initial taskmanager implementation ([ef5515c](https://github.com/monterey-framework/monterey/commit/ef5515c))
* **tiles:** added icons ([1f0c2fe](https://github.com/monterey-framework/monterey/commit/1f0c2fe))


### Features

* **all:** show/hide irrelevant tiles ([d840469](https://github.com/monterey-framework/monterey/commit/d840469))
* **app-launcher:** customizable app launchers ([01fe7c0](https://github.com/monterey-framework/monterey/commit/01fe7c0))
* **jspm:** add install handler ([436b542](https://github.com/monterey-framework/monterey/commit/436b542))
* **jspm:** first take on jspm detection ([fe6266a](https://github.com/monterey-framework/monterey/commit/fe6266a))
* **main:** added main screen ([4eff4e6](https://github.com/monterey-framework/monterey/commit/4eff4e6))
* **npm:** npm ([38c8f6a](https://github.com/monterey-framework/monterey/commit/38c8f6a))
* **plugins:** allow plugin to replace entire right hand side of the main screen ([0233590](https://github.com/monterey-framework/monterey/commit/0233590))
* **plugins:** initial plugin setup ([7e19161](https://github.com/monterey-framework/monterey/commit/7e19161))
* **project-detection:** detect package.json in multiple locations or ask user ([a6dd158](https://github.com/monterey-framework/monterey/commit/a6dd158))
* **scaffolding:** add aurelia-cli functionality ([9cb9ce3](https://github.com/monterey-framework/monterey/commit/9cb9ce3))
* **scaffolding:** finished wizard ([b0f9b8a](https://github.com/monterey-framework/monterey/commit/b0f9b8a))
* **scaffolding:** previous button ([7f0ba80](https://github.com/monterey-framework/monterey/commit/7f0ba80))
* **scaffolding:** scaffold from either cli, skeleton-navigation or zip ([cd7b918](https://github.com/monterey-framework/monterey/commit/cd7b918))
* **scaffolding:** scaffold project after wizard completes ([ec23bb2](https://github.com/monterey-framework/monterey/commit/ec23bb2))
* **scaffolding:** start of project scaffolding screen ([a6ebc2b](https://github.com/monterey-framework/monterey/commit/a6ebc2b))
* **taskbar:** taskbar implementation ([6ebcf75](https://github.com/monterey-framework/monterey/commit/6ebcf75))
* **taskmanager:** task detail wip ([0ed55dc](https://github.com/monterey-framework/monterey/commit/0ed55dc))




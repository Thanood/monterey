# Monterey shell

[![Join the chat at https://gitter.im/monterey-framework/shell](https://badges.gitter.im/monterey-framework/shell.svg)](https://gitter.im/monterey-framework/shell?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The shell brings together all the required core Monterey libraries into a ready-to-go application Monterey application

[Global overview](https://github.com/monterey-framework/framework/blob/master/README.md)

### How to run
Suggested folder structure:
- monterey
   - shell
   - monterey-pal
   - monterey-pal-electron

From inside the shell folder:

1. npm install
2. jspm install
3. gulp watch (manually reloading electron with ctrl+R is required) or gulp watch-r to automatically reload electron


### Working on the pal
From inside the shell folder:

```
cd ../monterey-pal
gulp build
jspm link -y
cd ../monterey-pal-electron
gulp build
jspm link -y
cd ../shell
jspm install monterey-pal=github:monterey-pal@0.1.1 --link -y
jspm install monterey-pal-electron=github:monterey-pal-electron@0.1.1 --link -y
```

Note, these commands should be executed after every change in monterey-pal or monterey-pal-electron

^^^^ it may be necessary to change the version number of monterey-pal and monterey-pal-electron to whatever is in the package.json of monterey-pal and monterey-pal-electron


In order to unlink both monterey-pal and monterey-pal-electron the following commands can be used:

```
jspm install monterey-pal=github:monterey-framework/monterey-pal@0.1.1 --unlink
jspm install monterey-pal-electron=github:monterey-framework/monterey-pal-electron@0.1.1 --unlink
```

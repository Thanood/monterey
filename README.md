# Monterey is still in active development and is not ready to be used

# Monterey

[![Join the chat at https://gitter.im/monterey-framework/shell](https://badges.gitter.im/monterey-framework/shell.svg)](https://gitter.im/monterey-framework/shell?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Monterey is an extensible application that provides a graphical user interface for a collection of tools to simplify the creation, configuration and maintenance of Aurelia applications.

### What does Monterey look like
![](http://i.imgur.com/XfG3lvP.png)

### Initial feature set
1. Maintain a list of Aurelia projects in a single application
2. Create new Aurelia project (via [aurelia-cli](https://github.com/aurelia/cli) or skeleton-navigation) through a GUI
3. A GUI that shows JSPM dependencies (current versions and latest versions), update functionality and warning of forks
4. NPM install functionality
5. Configurable app launchers for things like explorer.exe and cmd.exe or custom ones

### How to install and use Monterey
To be determined (https://github.com/monterey-framework/monterey/issues/17)

### How to develop Monterey
Suggested folder structure:
- monterey
   - monterey
   - monterey-pal
   - monterey-pal-electron

From inside the monterey folder:

1. npm install
2. jspm install
3. gulp watch (manually reloading electron with ctrl+R is required) or gulp watch-r to automatically reload electron


### Working on the pal
From inside the monterey folder:

```
cd ../monterey-pal
gulp build
jspm link github:monterey-framework/monterey-pal -y
cd ../monterey-pal-electron
gulp build
jspm link github:monterey-framework/monterey-pal-electron -y
cd ../monterey
jspm install monterey-pal=github:monterey-framework/monterey-pal --link -y
jspm install monterey-pal-electron=github:monterey-framework/monterey-pal-electron --link -y
```

Note, these commands should be executed after every change in monterey-pal or monterey-pal-electron

^^^^ it may be necessary to change the version number of monterey-pal and monterey-pal-electron to whatever is in the package.json of monterey-pal and monterey-pal-electron


In order to unlink both monterey-pal and monterey-pal-electron the following commands can be used:

```
jspm install monterey-pal=github:monterey-framework/monterey-pal@0.1.1 --unlink
jspm install monterey-pal-electron=github:monterey-framework/monterey-pal-electron@0.1.1 --unlink
```

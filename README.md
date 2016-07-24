# Monterey

[![Join the chat at https://gitter.im/monterey-framework/shell](https://badges.gitter.im/monterey-framework/shell.svg)](https://gitter.im/monterey-framework/shell?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/monterey-framework/monterey.svg?branch=master)](https://travis-ci.org/monterey-framework/monterey)
[![Build status](https://ci.appveyor.com/api/projects/status/cc265tb7drdf9wh6?svg=true)](https://ci.appveyor.com/project/JeroenVinke/monterey)
[![release](https://img.shields.io/github/release/monterey-framework/monterey.svg)]()

https://travis-ci.org/aurelia-ui-toolkits/aurelia-kendoui-bridge.svg

Monterey is an extensible application that provides a graphical user interface for a collection of tools to simplify the creation, configuration and maintenance of Aurelia applications.

### What does Monterey look like
![](http://i.imgur.com/5mBNBC3.png)

More screenshots [here](http://imgur.com/a/Zm9MZ)


### How to install and use Monterey
1. At the bottom of [this page](https://github.com/monterey-framework/monterey/releases/latest) download the appropriate ZIP for your platform
2. Extract the ZIP
3. Run monterey (on windows open monterey.exe)

### How to develop Monterey
Suggested folder structure:
- monterey
   - monterey
   - monterey-pal
   - monterey-pal-electron

From inside the monterey folder:

1. npm install
2. cd app
3. npm install
4. jspm install
5. gulp watch (manually reloading electron with ctrl+R is required) or gulp watch-r to automatically reload electron


### Working on the pal
**Note that this step is not immediately required in order to work on Monterey**

Check out [this tool](https://github.com/vegarringdal/montery-dev) which automates the process defined below.

Make sure that you have run `npm install` and `jspm install` for both `monterey-pal` as well as `monterey-pal-electron`.

From inside monterey's `app` folder:

```
cd ../../monterey-pal
gulp build
jspm link github:monterey-framework/monterey-pal -y
cd ../monterey-pal-electron
gulp build
jspm link github:monterey-framework/monterey-pal-electron -y
cd ../monterey/app
jspm install monterey-pal=github:monterey-framework/monterey-pal --link -y
jspm install monterey-pal-electron=github:monterey-framework/monterey-pal-electron --link -y
```

Note, these commands should be executed after every change in monterey-pal or monterey-pal-electron

^^^^ it may be necessary to change the version number of monterey-pal and monterey-pal-electron to whatever is in the package.json of monterey-pal and monterey-pal-electron


In order to unlink both monterey-pal and monterey-pal-electron the following commands can be used:

```
jspm install monterey-pal=github:monterey-framework/monterey-pal --unlink
jspm install monterey-pal-electron=github:monterey-framework/monterey-pal-electron --unlink
```

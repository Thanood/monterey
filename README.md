# Monterey shell

[![Join the chat at https://gitter.im/monterey-framework/shell](https://badges.gitter.im/monterey-framework/shell.svg)](https://gitter.im/monterey-framework/shell?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
The shell brings together all the required core Monterey libraries into a ready-to-go application Monterey application

[Global overview](https://github.com/monterey-framework/framework/blob/master/README.md)

### How to run
The following folder structure is recommended for development on Monterey:

![img](http://i.imgur.com/ZBeDtdf.png)

From inside the shell folder:

1. npm install
2. jspm install
3. gulp watch

### How to work on plugins
The following steps use the `scaffolding` plugin, but any plugin can be worked on this way:
1. clone the plugin into the folder structure shown above
2. from inside the shell folder run: `jspm link ../scaffolding/src`
3. changes now made to the scaffolding plugin become visible when reloading the shell application
4. when done, unlink the package via `jspm install --unlink`

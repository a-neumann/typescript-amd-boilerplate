#Typescript AMD Boilerplate

A project setup for creating frontend stuff with typescript and AMD modules.

##Features

- **Bundles Typescript** to JS.
- **Bundles LESS** to CSS. Feel free to replace LESS with some other CSS preprocessor.
- **Include libraries** into the bundle or load them from a **CDN with a fallback**.
- **Live reloading** with Browsersync in the pre-build workflow.
- **Debug Typescript** files with Visual Studio Code linked to the Chrome debugger.
- Ties **HTML templates** and Typescript code together in one file for creating web-components.
- Minimal configuration for including Bower dependencies into the bundle.
- No Browserify or Webpack needed. Work with tools like Gulp and Bower, you already love.

## Project Structure

Directory/File | Prupose
:---------------------- | :---
`src/`                  | Your work directory. This directory is also served by Browsersync during the debug mode.
`src/index.html`        | Self explaining...
`src/scripts/`          | The root folder of your Typescript files. You can safely add subdirectories and ADM reference to scripts relative from there.
`src/scripts/main.ts`   | The startup script, like defined in the `gulpfile.js`
`src/scripts/typings`   | Used by [tsd](http://https://github.com/Definitelytyped/tsd) to store Typescript definitions in there. Make sure to call `tsd install` from `src/scripts`.
`src/styles/`           | Where the LESS stylesheets should go.
`src/lib/`              | Bower copies the libs into there, like configured in the `.bowerrc` file.
`src/lib.json`          | Configure your references here.
`src/require.config.js` | Dont't configure anything here. This file will be created by the `config` task.
`dist/`                 | The output directory that will be created by the `dist` task, once you done.
`.vscode/launch.json`   | Setup the VSCode debugger to attach to Google Chrome, when you hit *Debug*
`.vscode/settings.json` | Make VSCode hide generated `.css`, `.js`, and `.map` files in the `src/` folder from you. Just for a cleaner view.
`.vscode/tasks.json`    | Make VSCode use Gulp tasks -nothing fancy.

## Gulp tasks

Name | Prupose
:---------- | :---
`scripts`   | Compile Typescript files in the `src/srcipts` folder.
`templates` | Compile `template.html` files in the `src/srcipts` folder to a require modules named *template*.
`styles`    | Compile LESS files in the `src/styles` folder.
`config`    | Creates the `require.config.js` file for you, from the `lib.json` file you made.
`debug`     | Executes the tasks above and launches BrowserSync and Chrome. You can start the VSCode Debugger now. Terminate the task after you're done.
`bs-reload` | Manually reload BrowserSync, if needed.
`dist`      | Bundles the code files and deploys them into the `dist/` folder.
`clean`     | Clean up the `dist/` folder.

#Workflow

###Download

````bash
git clone https://github.com/a-neumann/typescriptamdboilerplate.git
````

###Load requisites

````bash
npm install
````

###Debug

The following works only in *Visual Studio Code*. You should be able use Chrome to debug your code without VSCode, because Browsersync serves the sourcemaps.

If you haven't installed the *Debugger for Chrome* Extension yet, type in the command palette:

````bash
ext install Debugger for Chrome
````

Set some breakpoints in you Typescript. In the VSCode command palette, type:

````bash
task debug
````

In the *Debug* tab, the button sould display **attach to chrome**.

###Build

To produce some output to the `dist/` folder, type the following or press `Strg + Shift + B`:

````bash
task dist
````

##Adding a bower library

Install it with Bower, then open the `src/lib.json` file and add an item to the `paths` object.

### Include it into the minified bundle

````json
{
    "baseUrl": "scripts",
    "paths": {
        "examplelib": "../lib/examplelib/dist/examplelib"
    }
}
````

### Link to CDN with a local fallback

````json
{
    "baseUrl": "scripts",
    "paths": {
        "examplelib": [
            "https://cdnjs.cloudflare.com/ajax/libs/examplelib/1.0.0/examplelib.min",
            "../lib/examplelib/dist/examplelib"
        ]
    }
}
````

Next time you build or debug, the `require.config.js` file will be generated automatically.
/// <reference path="../typings/tsd.d.ts"/>
/// <amd-dependency name="template" path="./template"/>

// load a library defined in lib.json
import mustache = require("mustache");

class MyComponnet {

    constructor(target: HTMLElement) {
        this.target = target;
    }

    private target: HTMLElement

    // template comes from <amd-dependency/> above
    // It's declared for Typescript as string in typings/template.d.ts
    messageTemplate: string = template

    greet(name: string) {

        var html = mustache.render(this.messageTemplate, { username: name });
        this.target.innerHTML = html;
    }
}

export = MyComponnet;
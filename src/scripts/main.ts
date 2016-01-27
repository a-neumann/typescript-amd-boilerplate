/// <reference path="typings/tsd.d.ts"/>
import MyComponent = require("./my-component/my-component");

var myGreeter = new MyComponent(document.body);
myGreeter.greet("User");
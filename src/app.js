"use strict";

// let ajax = require("jquery/src/ajax");

// require('jquery');
// require("bootstrap");
// require("bootstrap/dist/css/bootstrap.min.css");
require("./scheduler/styles/scheduler.less");

let Scheduler = require("./scheduler/index");
let Config = require("./scheduler/classes/Config");

Config(require("./config/config.json"));


var xhr = new XMLHttpRequest();
xhr.open('GET', encodeURI('./data/schedule.json'));
xhr.onload = function() {
  if (xhr.status === 200) {
    // alert('User\'s name is ' + xhr.responseText);
    let config = JSON.parse(xhr.responseText);
    bootstrap(config);
  }
};
xhr.send();


function bootstrap(config) {
  var root = document.getElementById("schedule");
  var schedule = new Scheduler(root, config);
  // schedule.render();
}

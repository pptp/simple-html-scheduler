"use strict";

import EventEmitter from 'events';
class Emitter extends EventEmitter {}
const emitter = new Emitter();

module.exports = emitter;
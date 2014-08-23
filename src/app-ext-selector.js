/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./object-generator-ext-selector');

recorder.init({
    generateObject: codeGenerator.generateObject,
    eventsToRecord: eventsToRecord
});
window.recorderES = recorder;
module.exports = recorder;
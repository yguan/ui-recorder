/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator-ext');

recorder.init({
    generateCode: codeGenerator.generateCode,
    eventsToRecord: eventsToRecord
});
window.recorderExt = recorder;
module.exports = recorder;
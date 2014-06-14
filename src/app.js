/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator');

recorder.init({
    generateCode: codeGenerator.getCssSelectorActionCode,
    eventsToRecord: eventsToRecord
});
recorder.record();
window.recorder = recorder;
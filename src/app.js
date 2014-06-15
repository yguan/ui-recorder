/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator');
var getElements = require('./elements-to-listen').getElements;

recorder.init({
    generateCode: codeGenerator.getCssSelectorActionCode,
    eventsToRecord: eventsToRecord,
    getElementsToListen: getElements
});
recorder.record();
window.recorder = recorder;
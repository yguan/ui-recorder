/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator');
var elementsToListen = require('./elements-to-listen').getElements();

recorder.init({
    generateCode: codeGenerator.getCssSelectorActionCode,
    eventsToRecord: eventsToRecord,
    elementsToListen: elementsToListen
});
recorder.record();
window.recorder = recorder;
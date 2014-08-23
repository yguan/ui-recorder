/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var cssSelectorFactory = require('./css-selector-factory');
var eventCoordinators = require('./event-coordinates');

function generateCode(evt) {
    var cssSelector = cssSelectorFactory.getSelector(evt.target),
        coordinates = eventCoordinators.getClientCoordinates(evt);
    return evt.type + ' \'' + cssSelector + '\' ' + JSON.stringify(coordinates);
}

recorder.init({
    generateCode: generateCode,
    eventsToRecord: eventsToRecord
});
window.recorderCss = recorder;
module.exports = recorder;
/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    cssSelectorFactory = require('./css-selector-factory'),
    customEventCode = require('./custom-event-code');

function getEventCode(evt) {
    var code = eventCodingMap[evt.type];

    if (code) {
        return code;
    }

    // handle non-existing events
    return eventCodingMap[customEventCode.getType(evt)];
}

function generateCode(evt) {
    var cssSelector = cssSelectorFactory.getSelector(evt.target),
        code = getEventCode(evt);

    if (code) {
        return code + '(\'' + cssSelector + '\')';
    }

    return evt.type + ' \'' + cssSelector + '\'';
}

module.exports = {
    generateCode: generateCode
};
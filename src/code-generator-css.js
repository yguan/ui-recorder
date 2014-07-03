/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    cssSelectorFactory = require('./css-selector-factory'),
    eventCoordinators = require('./event-coordinates');

function generateCode(evt) {
    var cssSelector = cssSelectorFactory.getSelector(evt.target),
        code = eventCodingMap.getEventCode(evt),
        coordinates = eventCoordinators.getClientCoordinates(evt);

    if (code) {
        return code + '(\'' + cssSelector + '\', ' + JSON.stringify(coordinates) + ')';
    }

    return evt.type + ' \'' + cssSelector + '\' ' + JSON.stringify(coordinates);
}

module.exports = {
    generateCode: generateCode
};
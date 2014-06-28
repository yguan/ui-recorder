/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    cssSelectorFactory = require('./css-selector-factory');

function generateCode(evt) {
    var cssSelector = cssSelectorFactory.getSelector(evt.target),
        code = eventCodingMap.getEventCode(evt);

    if (code) {
        return code + '(\'' + cssSelector + '\')';
    }

    return evt.type + ' \'' + cssSelector + '\'';
}

module.exports = {
    generateCode: generateCode
};
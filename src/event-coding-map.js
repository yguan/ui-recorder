/*jslint nomen: true*/
/*global $,define,require,module */

var customEvent = require('./custom-event'),
    codingMap = {
        click: '.waitAndClick',
        enterText: '.typeValue' // this is a non-existing event to represent type in values to a textbox or textarea
    };

function getEventCode(evt) {
    var code = codingMap[evt.type];

    if (code) {
        return code;
    }

    // handle non-existing events
    return codingMap[customEvent.getType(evt)];
}

module.exports = {
    getEventCode: getEventCode
};
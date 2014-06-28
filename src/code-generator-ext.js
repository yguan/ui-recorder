/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    extComponentQueryFactory = require('./ext-component-query-factory');

function generateCode(evt) {
    var query = JSON.stringify(extComponentQueryFactory.getQuery(evt.target)),
        code = eventCodingMap.getEventCode(evt);

    if (code) {
        return code + '(\'' + query + '\')';
    }

    return evt.type + ' \'' + query + '\'';
}

module.exports = {
    generateCode: generateCode
};
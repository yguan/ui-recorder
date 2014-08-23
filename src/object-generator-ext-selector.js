/*jslint nomen: true*/
/*global $,define,require,module */

var extComponentQueryFactory = require('./ext-component-query-factory');

function generateObject(evt) {
    var query = extComponentQueryFactory.getQuery(evt.target);
    query.event = evt.type;

    return query;
}

module.exports = {
    generateObject: generateObject
};
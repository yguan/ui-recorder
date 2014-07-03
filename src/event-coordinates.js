/*jslint nomen: true*/
/*global $,define,require,module */

var eventsWithCoordinates = {
    mouseup: true,
    mousedown: true,
    mousemove: true,
    mouseover: true
};

function getClientCoordinates(evt) {
    if (!eventsWithCoordinates[evt.type]) {
        return '';
    }

    return {
        x: evt.clientX,
        y: evt.clientY
    };
}

module.exports = {
    getClientCoordinates: getClientCoordinates
};
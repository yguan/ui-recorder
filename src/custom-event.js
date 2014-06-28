/*jslint nomen: true*/
/*global $,define,require,module */

function isEnterText(evt) {
    var element = evt.target;
    return (element.type === 'text' || element.type === 'textarea') && evt.type === 'keyup';
}

function getCustomEventType(evt) {
    if (isEnterText(evt)) {
        return 'enterText';
    }
}

module.exports = {
    getType: getCustomEventType
};
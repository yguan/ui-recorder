/*jslint nomen: true*/
/*global $,define,require,module */

function up(el, stopCondition) {
    while (el.parentNode) {
        el = el.parentNode;
        if (stopCondition(el)) {
            break;
        }
    }
    return el;
}

module.exports = {
    up: up
};
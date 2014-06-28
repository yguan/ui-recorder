/*jslint nomen: true*/
/*global $,define,require,module */

function up(el, stopCondition) {
    var target = el;

    while (target.parentNode) {
        target = target.parentNode;
        if (stopCondition(target)) {
            break;
        }
    }
    return target;
}

module.exports = {
    up: up
};
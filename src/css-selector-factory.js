/*jslint nomen: true*/
/*global $,define,require,module */

var dom = require('./dom');

function getIdOrCls(el) {
    if (el.id) {
        return '#' + el.id;
    } else if (el.classList && el.classList.length > 0) {
        return '.' + el.className.split(' ').join('.');
    }
    return '';
}

function getCssSelector(el) {
    var selectorList = ['', ''],
        selector,
        parentEl;

    selectorList[1] = getIdOrCls(el);

    if (el.id) {
        return selectorList[1];
    }

    if (selectorList[1].length === 0) {
        selector = el.nodeName;

        if (selector === 'A') {
            selector += ':contains(' + el.textContent + ')'
        }
        selectorList[1] = selector;
    }

    parentEl = dom.up(el, function (element) {
        return getIdOrCls(element).length > 0;
    });

    selectorList[0] = getIdOrCls(parentEl);

    return selectorList.join(' ').trim();
}

module.exports = {
    getSelector: getCssSelector
};
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

    parentEl = up(el, function () {
        return getIdOrCls(el).length > 0;
    });

    selectorList[0] = getIdOrCls(parentEl);

    return selectorList.join(' ');
}

function getCssSelectorActionCode(e) {
    var cssSelector = getCssSelector(e.target);
    return e.type + ' \'' + cssSelector + '\'';
}

module.exports = {
    getCssSelector: getCssSelector,
    getCssSelectorActionCode: getCssSelectorActionCode
};
/*jslint nomen: true*/
/*global $,define,require,_ */

(function () {
    'use strict';

    function bind(el, eventType, handler) {
        if (el.addEventListener) { // DOM Level 2 browsers
            el.addEventListener(eventType, handler, false);
        } else if (el.attachEvent) { // IE <= 8
            el.attachEvent('on' + eventType, handler);
        } else { // ancient browsers
            el['on' + eventType] = handler;
        }
    }

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
            return el.id;
        } else if (el.classList) {
            return el.className.split(' ').join('.');
        }
        return '';
    }

    function getCssSelectors(el) {
        var selectorList = ['', ''],
            selector,
            parentEl;

        selectorList[1] = getIdOrCls(el);
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

    function record() {
        bind(document.body, 'click', function (e) {
            console.log(getCssSelectors(e.target));
        });
    }

    window.recorder = {
        record: record
    };

}());
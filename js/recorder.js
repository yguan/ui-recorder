/*jslint nomen: true*/
/*global $,define,require,_ */

(function () {
    'use strict';

    var events = [
        'click',
        'focus',
        'blur',
        'dblclick',
        'change',
        'keyup',
//        'keydown',
//        'keypress',
//        'mousedown',
//        'mousemove',
//        'mouseout',
//        'mouseover',
        'mouseup',
        'resize',
        'scroll',
        'select',
        'submit',
        'load',
        'unload'
    ];
    var recordedActions = '';

    function bind(el, eventType, handler) {
        if (el.addEventListener) { // DOM Level 2 browsers
            el.addEventListener(eventType, handler, false);
        } else if (el.attachEvent) { // IE <= 8
            el.attachEvent('on' + eventType, handler);
        } else { // ancient browsers
            el['on' + eventType] = handler;
        }
    }

    function unbind(el, eventType, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventType, handler, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + eventType, handler);
        } else {
            el["on" + eventType] = null;
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
            return '#' + el.id;
        } else if (el.classList) {
            return el.className.split(' ').join('.');
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

    function record() {
        var i = 0,
            len = events.length;

        for (; i < len; i = i + 1) {
            bind(document.body, events[i], function (e) {
                var cssSelector = getCssSelector(e.target),
                    action = e.type + ' \'' + cssSelector + '\'';

                recordedActions = recordedActions + action + '\n';
                console.log(action);
            });
        }
    }

    // stop doesn't work in browser console yet
    function stop() {
        var i = 0,
            len = events.length;

        for (; i < len; i = i + 1) {
            unbind(document.body, events[i], function () {
            });
        }
    }

    function getRecordedActions() {
        return recordedActions;
    }

    function clearRecordedActions() {
        return recordedActions = '';
    }

    window.recorder = {
        record: record,
        stop: stop,
        getRecordedActions: getRecordedActions,
        clearRecordedActions: clearRecordedActions
    };

}());

recorder.record();
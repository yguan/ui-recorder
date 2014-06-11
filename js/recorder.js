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
    

}());
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator');

recorder.init({
    generateCode: codeGenerator.getCssSelectorActionCode,
    eventsToRecord: eventsToRecord
});
window.recorder = recorder;
},{"./code-generator":2,"./events-to-record":4,"./recorder":5}],2:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map');

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

    return selectorList.join(' ').trim();
}

function isEnterText(e) {
    var element = e.target;
    return (element.type === 'text' || element.type === 'textarea') && e.type === 'keyup';
}

function getCustomEventCode(e) {
    if (isEnterText(e)) {
        return 'enterText';
    }
}

function getEventCode(e) {
    var code = eventCodingMap[e.type];

    if (code) {
        return code;
    }

    // handle non-existing events
    return eventCodingMap[getCustomEventCode(e)];
}

function getCssSelectorActionCode(e) {
    var cssSelector = getCssSelector(e.target),
        code = getEventCode(e);

    if (code) {
        return code + '(\'' + cssSelector + '\')';
    }

    return e.type + ' \'' + cssSelector + '\'';
}

module.exports = {
    getCssSelector: getCssSelector,
    getCssSelectorActionCode: getCssSelectorActionCode
};
},{"./event-coding-map":3}],3:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

module.exports = {
    click: '.waitAndClick',
    enterText: '.typeValue' // this is a non-existing event to represent type in values to a textbox or textarea
};
},{}],4:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

module.exports = [
    'click',
//    'focus',
//    'blur',
    'dblclick',
    'change',
    'keyup',
//    'keydown',
//    'keypress',
//    'mousedown',
//    'mousemove',
//    'mouseout',
//    'mouseover',
//    'mouseup',
    'resize',
//    'scroll',
    'select',
    'submit',
    'load',
    'unload'
];

//var events = [
//    abort,
//    afterprint,
//    beforeprint,
//    beforeunload,
//    blur,
//    canplay,
//    canplaythrough,
//    change,
//    click,
//    contextmenu,
//    copy,
//    cuechange,
//    cut,
//    dblclick,
//    DOMContentLoaded,
//    drag,
//    dragend,
//    dragenter,
//    dragleave,
//    dragover,
//    dragstart,
//    drop,
//    durationchange,
//    emptied,
//    ended,
//    error,
//    focus,
//    focusin,
//    focusout,
//    formchange,
//    forminput,
//    hashchange,
//    input,
//    invalid,
//    keydown,
//    keypress,
//    keyup,
//    load,
//    loadeddata,
//    loadedmetadata,
//    loadstart,
//    message,
//    mousedown,
//    mouseenter,
//    mouseleave,
//    mousemove,
//    mouseout,
//    mouseover,
//    mouseup,
//    mousewheel,
//    offline,
//    online,
//    pagehide,
//    pageshow,
//    paste,
//    pause,
//    play,
//    playing,
//    popstate,
//    progress,
//    ratechange,
//    readystatechange,
//    redo,
//    reset,
//    resize,
//    scroll,
//    seeked,
//    seeking,
//    select,
//    show,
//    stalled,
//    storage,
//    submit,
//    suspend,
//    timeupdate,
//    undo,
//    unload,
//    volumechange,
//    waiting
//];
},{}],5:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recordedCode = '',
    generateCode,
    eventsToRecord,
    windowToListen;

function init(config) {
    generateCode = config.generateCode;
    eventsToRecord = config.eventsToRecord;
}

function setWindowToListen(windowElement) {
    windowToListen = windowElement;
}

// Each frame is a window
function getAllFrames(windowElement, allFrames) {
    allFrames.push(windowElement.frames);
    for (var i = 0; i < windowElement.frames.length; i++) {
        getAllFrames(windowElement.frames[i], allFrames);
    }
    return allFrames;
}

function getElementsToListen(windowElement) {
    return getAllFrames(windowElement, []);
}

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

function manageSingleElementEvents(element, action, events, handler) {
    var eventIndex = 0,
        eventCount = events.length;

    for (; eventIndex < eventCount; eventIndex++) {
        action(element, events[eventIndex], handler);
    }
}

function manageEvents(elements, action, events, handler) {
    var elementIndex = 0,
        elementCount = elements.length;

    for (; elementIndex < elementCount; elementIndex++) {
        // Have to attach events with some delay between iframes. Otherwise, iframe events are not captured
        setTimeout(manageSingleElementEvents, 50, elements[elementIndex], action, events, handler);
    }
}

function recordEvent(e) {
    var code = generateCode(e);

    recordedCode = recordedCode + code + '\n';
    console.log(code);
}

function record() {
    var elementsToListen = getElementsToListen(windowToListen || window);
    manageEvents(elementsToListen, bind, eventsToRecord, recordEvent);
}

function stop() {
    var elementsToListen = getElementsToListen(windowToListen || window);
    manageEvents(elementsToListen, unbind, eventsToRecord, recordEvent);
}

function getRecordedCode() {
    return recordedCode;
}

function clearRecordedCode() {
    return recordedCode = '';
}

module.exports = {
    init: init,
    setWindowToListen: setWindowToListen,
    record: record,
    stop: stop,
    getRecordedCode: getRecordedCode,
    clearRecordedCode: clearRecordedCode
};

},{}]},{},[1])
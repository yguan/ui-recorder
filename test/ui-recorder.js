(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator-css');

recorder.init({
    generateCode: codeGenerator.generateCode,
    eventsToRecord: eventsToRecord
});
window.recorder = recorder;
module.exports = recorder;
},{"./code-generator-css":2,"./events-to-record":8,"./recorder":9}],2:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    cssSelectorFactory = require('./css-selector-factory'),
    eventCoordinators = require('./event-coordinates');

function generateCode(evt) {
    var cssSelector = cssSelectorFactory.getSelector(evt.target),
        code = eventCodingMap.getEventCode(evt),
        coordinates = eventCoordinators.getClientCoordinates(evt);

    if (code) {
        return code + '(\'' + cssSelector + '\', ' + JSON.stringify(coordinates) + ')';
    }

    return evt.type + ' \'' + cssSelector + '\' ' + JSON.stringify(coordinates);
}

module.exports = {
    generateCode: generateCode
};
},{"./css-selector-factory":3,"./event-coding-map":6,"./event-coordinates":7}],3:[function(require,module,exports){
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
},{"./dom":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var customEvent = require('./custom-event'),
    codingMap = {
        click: '.waitAndClick',
        enterText: '.typeValue' // this is a non-existing event to represent type in values to a textbox or textarea
    };

function getEventCode(evt) {
    var code = codingMap[evt.type];

    if (code) {
        return code;
    }

    // handle non-existing events
    return codingMap[customEvent.getType(evt)];
}

module.exports = {
    getEventCode: getEventCode
};
},{"./custom-event":4}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
    'mousedown',
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
},{}],9:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recordedCode = '',
    generateCode,
    generateObject,
    eventsToRecord,
    windowToListen;

function init(config) {
    generateCode = config.generateCode;
    generateObject = config.generateObject;
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
    var code;

    if (generateObject) {
        console.recorderLog(JSON.stringify(generateObject(e), true, 2));
    }
    if (generateCode) {
        code = generateCode(e);

        recordedCode = recordedCode + code + '\n';
        console.recorderLog(code);
    }
}

function record() {
    var elementsToListen = getElementsToListen(windowToListen || window);
    console.recorderLog = console.log; // hijack the console.log so that only recorded code will be shown
    console.log = function () {};
    manageEvents(elementsToListen, bind, eventsToRecord, recordEvent);
}

function stop() {
    var elementsToListen = getElementsToListen(windowToListen || window);
    if (console.recorderLog) {
        console.log = console.recorderLog;
    }
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
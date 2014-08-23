(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./object-generator-ext-selector');

recorder.init({
    generateObject: codeGenerator.generateObject,
    eventsToRecord: eventsToRecord
});
window.recorderES = recorder;
module.exports = recorder;
},{"./events-to-record":2,"./object-generator-ext-selector":4,"./recorder":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module,Ext */

function getComponent(el) {
    var cmp,
        target = el;

    while (target) {
        cmp = Ext.getCmp(target.id);

        if (cmp) {
            return cmp;
        }

        target = target.parentNode;
    }

    return null;
}

function getQuery(el) {
    var cmp = getComponent(el),
        query;

    if (!cmp) {
        return 'No component query available.';
    }

    // Depend on the ExtJS app, either itemId or cls may be the right one to use.
    // Use cmp.cls with cmp.getXType() to create 'someXtype[cls=someClass]'
    query = {
        itemId: cmp.getItemId(),
        cls: cmp.cls,
        xtype: cmp.getXType(),
        el: {
            name: el.nodeName,
            className: el.className
        }
    };

    return query;
}

module.exports = {
    getQuery: getQuery
};
},{}],4:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var extComponentQueryFactory = require('./ext-component-query-factory');

function generateObject(evt) {
    var query = extComponentQueryFactory.getQuery(evt.target);
    query.event = evt.type;

    return query;
}

module.exports = {
    generateObject: generateObject
};
},{"./ext-component-query-factory":3}],5:[function(require,module,exports){
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
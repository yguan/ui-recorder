(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var recorder = require('./recorder');
var eventsToRecord = require('./events-to-record');
var codeGenerator = require('./code-generator-ext');

recorder.init({
    generateCode: codeGenerator.generateCode,
    eventsToRecord: eventsToRecord
});
window.recorder = recorder;
module.exports = recorder;
},{"./code-generator-ext":2,"./events-to-record":5,"./recorder":7}],2:[function(require,module,exports){
/*jslint nomen: true*/
/*global $,define,require,module */

var eventCodingMap = require('./event-coding-map'),
    extComponentQueryFactory = require('./ext-component-query-factory');

function generateCode(evt) {
    var query = JSON.stringify(extComponentQueryFactory.getQuery(evt.target)),
        code = eventCodingMap.getEventCode(evt);

    if (code) {
        return code + '(\'' + query + '\')';
    }

    return evt.type + ' \'' + query + '\'';
}

module.exports = {
    generateCode: generateCode
};
},{"./event-coding-map":4,"./ext-component-query-factory":6}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"./custom-event":3}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
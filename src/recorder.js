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

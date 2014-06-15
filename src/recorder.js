/*jslint nomen: true*/
/*global $,define,require,module */

var recordedCode = '',
    generateCode,
    eventsToRecord,
    getElementsToListen;

function init(config) {
    getElementsToListen = config.getElementsToListen;
    generateCode = config.generateCode;
    eventsToRecord = config.eventsToRecord;
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
    var elementsToListen = getElementsToListen();
    manageEvents(elementsToListen, bind, eventsToRecord, recordEvent);
}

function stop() {
    var elementsToListen = getElementsToListen();
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
    record: record,
    stop: stop,
    getRecordedCode: getRecordedCode,
    clearRecordedCode: clearRecordedCode
};

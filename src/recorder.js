/*jslint nomen: true*/
/*global $,define,require,module */

var recordedCode = '',
    generateCode,
    eventsToRecord;

function init(config) {
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

function manageEvents(action, events, handler) {
    var i = 0,
        len = events.length;

    for (; i < len; i = i + 1) {
        action(document.body, events[i], handler);
    }
}
function recordEvent(e) {
    var code = generateCode(e);

    recordedCode = recordedCode + code + '\n';
    console.log(code);
}

function record() {
    manageEvents(bind, eventsToRecord, recordEvent);
}

function stop() {
    manageEvents(unbind, eventsToRecord, recordEvent);
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

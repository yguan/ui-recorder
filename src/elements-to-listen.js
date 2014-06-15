/*jslint nomen: true*/
/*global $,define,require,module */

// Each frame is a window
function getAllFrames(windowElement, allFrames) {
    allFrames.push(windowElement.frames);
    for (var i = 0; i < windowElement.frames.length; i++) {
        getAllFrames(windowElement.frames[i], allFrames);
    }
    return allFrames;
}

module.exports = {
    getElements: function () {
        return getAllFrames(window, []);
    }
};
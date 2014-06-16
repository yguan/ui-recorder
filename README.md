# UI Recorder

This repository contains the source code of a browser event recorder, which supports capturing all user interaction in a browser and generating code for the captured interactions. It's simple and flexible, and it can easily be cusotmized to capture any browser events and to generate any kind of test automation code. It aims to become a generic browser event recorder that can be used to develop any kind of UI recorders such as [Selenium IDE](http://docs.seleniumhq.org/projects/ide/).

## Overview

The basic concept of the UI Recorder is extremely simple. It adds event listeners to the browser's window and frames so that it can capture the specific events and then generate code based on the events.

## Demo

Click on [this link](http://yguan.github.io/repos/ui-recorder/) to go to the test page, open the browser console, click somewhere on the test page, and you should see the recorded code shown in the console. You can run `recorder.getRecordedCode()` to get the recorded code.

## Development

#### Overview of Folder Structure

* `src` contains the pre-build files of the UI Recorder.
* `test` contains the files for testing the UI recorder.
* `gulp` contains the gulp task files.

#### Anatomy of the UI Recorder

Here is the overview for the files under `src` folder:

* `app.js` is where the UI Recorder is initialized, and it is the entry point for gulp to build ui-recorder.js.
* `recorder.js` is the core of the UI Recorder. It provides interface to interact with the recorder and glues all the specific components, such as code generation.
* `elements-to-listen.js` specifies what elements to add listeners to.
* `events-to-record.js` specifies what events to listen.
* `code-generator.js` specifies how code is generated for an event.
* `event-coding-map.js` specifies what function name is used for an event for code generation.

#### Set up The Local Environment

Here are the steps:

* Install `gulp` globally if you haven't done so.
* Run `npm install`.
* Run `gulp` to build the `ui-recorder.js`.
* Run `gulp http` to start a http server at port `9000`.
  * Point your browser to `localhost:9000/index.html`.
  * Open browser's console.
  * Click some elements on the page and you should see the output from the recorder, and you can debug `ui-recorder.js`.

## Usage

For now, you have to manually copy and paste to get the recorder running, and here are the steps:

 Here are the steps;

* Open a browser and go to the site that you want to record user interactions.
* Open the browser's console (F12).
* Copy the code from [ui-recorder.js](https://raw.githubusercontent.com/yguan/ui-recorder/master/ui-recorder.js), paste it to the console, and run it.
* To stop the recorder, run `recorder.stop()` from the console.
* To start the recorder again, run `recorder.record()`.
* To get the recorded code, run `recorder.getRecordedCode()`.
* To clear the recorded code, run `recorder.clearRecordedCode()`.

## Todo

Here is a todo list to make UI Recorder better, and everyone is welcome to contribute to it:

* Create a Chrome extension to bypass the manual steps to run the recorder.
* Figure out a plugin architecture to make code generation easier to integrate.

## License

[MIT](http://opensource.org/licenses/MIT)
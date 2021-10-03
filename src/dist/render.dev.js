"use strict";

var _require = require('electron'),
    desktopCapturer = _require.desktopCapturer;

var _require2 = require('@electron/remote'),
    Menu = _require2.Menu,
    dialog = _require2.dialog;

var videoElement = document.querySelector('video');
var buttonStart = document.getElementById('buttonStart');
var buttonEnd = document.getElementById('buttonEnd');
var buttonSelector = document.getElementById('buttonSelector');
var errorMessage = document.getElementById('error');

var _require3 = require('fs'),
    writeFile = _require3.writeFile;

var mediaRecorder = undefined;
var recordedChuncks = [];

buttonStart.onclick = function (e) {
  if (!mediaRecorder) {
    errorMessage.classList.remove('hide');
    return;
  }

  mediaRecorder.start();
  buttonStart.classList.add('is-danger');
  buttonStart.innerText = 'Recording';
};

buttonEnd.onclick = function (e) {
  mediaRecorder.stop();
  buttonStart.classList.remove('is-danger');
  buttonStart.innerText = 'Start';
};

function getVideoSources() {
  var inputSources, videosOptionsMenu;
  return regeneratorRuntime.async(function getVideoSources$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(desktopCapturer.getSources({
            types: ['window', 'screen']
          }));

        case 2:
          inputSources = _context.sent;
          videosOptionsMenu = Menu.buildFromTemplate(inputSources.map(function (source) {
            return {
              label: source.name,
              click: function click() {
                return selectSource(source);
              }
            };
          }));
          console.log('videosOptionsMenu ', videosOptionsMenu);
          videosOptionsMenu.popup();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

function selectSource(source) {
  var options, stream;
  return regeneratorRuntime.async(function selectSource$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!errorMessage.classList.contains('hide')) {
            errorMessage.classList.add('hide');
          }

          buttonSelector.innerText = source.name;
          options = {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
              }
            }
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(navigator.mediaDevices.getUserMedia(options));

        case 5:
          stream = _context2.sent;
          videoElement.srcObject = stream;
          videoElement.play();
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9'
          });
          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.onstop = handleStop;

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function handleDataAvailable(e) {
  console.log('chunck video ', recordedChuncks);
  recordedChuncks.push(e.data);
}

function handleStop(e) {
  var blob, buffer, _ref, filePath;

  return regeneratorRuntime.async(function handleStop$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          blob = new Blob(recordedChuncks, {
            type: 'video/webm; codecs=vp9'
          });
          _context3.t0 = Buffer;
          _context3.next = 4;
          return regeneratorRuntime.awrap(blob.arrayBuffer());

        case 4:
          _context3.t1 = _context3.sent;
          buffer = _context3.t0.from.call(_context3.t0, _context3.t1);
          _context3.next = 8;
          return regeneratorRuntime.awrap(dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: "vid-".concat(Date.now(), ".webm")
          }));

        case 8:
          _ref = _context3.sent;
          filePath = _ref.filePath;

          if (filePath) {
            writeFile(filePath, buffer, function () {
              return console.log('video saved successfully!');
            });
          }

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
}

buttonSelector.onclick = function () {
  return getVideoSources();
};
"use strict";

var videoElement = document.querySelector('vide');
var buttonStart = document.getElementById('buttonStart');
var buttonEnd = document.getElementById('buttonEnd');
var buttonSelector = document.getElementById('buttonSelector');

var _require = require('electron'),
    desktopCapturer = _require.desktopCapturer;

var _require2 = require('@electron/remote'),
    Menu = _require2.Menu;

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
            console.log('source ', source);
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

buttonSelector.onclick = function () {
  return getVideoSources();
};
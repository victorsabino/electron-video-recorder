
const videoElement = document.querySelector('vide')
const buttonStart = document.getElementById('buttonStart')
const buttonEnd = document.getElementById('buttonEnd')
const buttonSelector = document.getElementById('buttonSelector')
const { desktopCapturer  } = require('electron')
const { Menu } = require('@electron/remote');

async function getVideoSources () {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
  const videosOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      console.log('source ', source)
      return {
        label: source.name,
        click: () => selectSource(source)
      }
    })
  )
  console.log('videosOptionsMenu ', videosOptionsMenu)
  videosOptionsMenu.popup();
}


buttonSelector.onclick = () => getVideoSources()
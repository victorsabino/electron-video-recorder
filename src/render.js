const { desktopCapturer  } = require('electron')
const { Menu, dialog } = require('@electron/remote');


const videoElement = document.querySelector('video')
const buttonStart = document.getElementById('buttonStart')
const buttonEnd = document.getElementById('buttonEnd')
const buttonSelector = document.getElementById('buttonSelector')
const errorMessage = document.getElementById('error')
const { writeFile } = require('fs');

let mediaRecorder = undefined;
let recordedChuncks = [];

buttonStart.onclick = e => {
  if (!mediaRecorder) {
    errorMessage.classList.remove('hide')
    return
  }
  mediaRecorder.start();
  buttonStart.classList.add('is-danger');
  buttonStart.innerText = 'Recording';
};

buttonEnd.onclick = e => {
  mediaRecorder.stop();
  buttonStart.classList.remove('is-danger');
  buttonStart.innerText = 'Start';
};

async function getVideoSources () {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videosOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      }
    })
  )
  console.log('videosOptionsMenu ', videosOptionsMenu)
  videosOptionsMenu.popup();
}

async function selectSource(source) {
  if (!errorMessage.classList.contains('hide')) {
    errorMessage.classList.add('hide');
  }
  buttonSelector.innerText = source.name;
  const options =  {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(options);
  videoElement.srcObject = stream;
  videoElement.play();
  mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9'});

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

}

function handleDataAvailable(e) {
  console.log('chunck video ', recordedChuncks);
  recordedChuncks.push(e.data);
}

async function handleStop (e) {
  const blob = new Blob(recordedChuncks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }
}


buttonSelector.onclick = () => getVideoSources()
const player = document.getElementById('player')
const recorderNode = document.getElementById("record")

recorderNode.addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
      .then(record)
})

const record = stream => {
  const mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.start()

  const audioChunks = []

  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data)
  })

  mediaRecorder.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunks)
    const audioUrl = URL.createObjectURL(audioBlob)
    player.src = audioUrl
    // const audio = new Audio(audioUrl)
    // audio.play()
  })

  setTimeout(() => {
   mediaRecorder.stop();
  }, 3000);



  // const context = new AudioContext()
  // const source = context.createMediaStreamSource(stream)
  // const processor = context.createScriptProcessor(1024, 1, 1)
  //
  //  source.connect(processor)
  //  processor.connect(context.destination)
  //
  //  processor.onaudioprocess = function(e) {
  //    // Do something with the data, i.e Convert this to WAV
  //    console.log(e.inputBuffer);
  //  };
};

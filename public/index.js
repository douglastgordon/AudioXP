const audio = document.getElementById("player")
const recorderNode = document.getElementById("record")

const audioCtx = new AudioContext()
const audioSrc = audioCtx.createMediaElementSource(audio)
const analyser = audioCtx.createAnalyser()
const fftSize = 4096
analyser.fftSize = fftSize
audioSrc.connect(analyser)
audioSrc.connect(audioCtx.destination)

const bufferlength = analyser.frequencyBinCount
const frequencyData = new Uint8Array(bufferlength)
analyser.getByteFrequencyData(frequencyData)
console.log(frequencyData)


// recorderNode.addEventListener("click", () => {
//   navigator.mediaDevices.getUserMedia({ audio: true }).then(record)
// })

const record = stream => {
  // const audioSrc = audioCtx.createMediaStreamSource(stream)
  // const analyser = audioCtx.createAnalyser()
  // analyser.fftSize = 2048
  // audioSrc.connect(analyser)
  // audioSrc.connect(audioCtx.destination)
  // const bufferlength = analyser.frequencyBinCount
  // const frequencyData = new Uint8Array(bufferlength)
  // analyser.getByteFrequencyData(frequencyData)
  // console.log(frequencyData)

  // const mediaRecorder = new MediaRecorder(stream)
  // mediaRecorder.start()

  // const audioChunks = []

  // mediaRecorder.addEventListener("dataavailable", event => {
    // audioChunks.push(event.data)
  // })

  // mediaRecorder.addEventListener("stop", () => {
  //   const audioBlob = new Blob(audioChunks)
  //   const audioUrl = URL.createObjectURL(audioBlob)
  //   player().src = audioUrl
  //   // const audio = new Audio(audioUrl)
  //   // audio.play()
  // })

  // setTimeout(() => {
  //  mediaRecorder.stop()
  //  console.log("stop recording")
  // }, 3000)
};

// const analyseFile = () => {
//   const audioCtx = new AudioContext()
//   const audio = player
//   console.log(audio)
//   const audioSrc = audioCtx.createMediaElementSource(audio)
//   const analyser = audioCtx.createAnalyser()
//   analyser.fftSize = 2048
//   audioSrc.connect(analyser)
//   audioSrc.connect(audioCtx.destination)
//   analyser.connect(audioCtx.destination);
//
//   const frequencyData = new Uint8Array(analyser.frequencyBinCount)
//   analyser.getByteFrequencyData(frequencyData);
//   console.log(frequencyData)
//
//   // return  analyser.getByteFrequencyData(frequencyData);
//
// }

// i = 240 2400

const sampleRate = audioCtx.sampleRate
const bandSize = (sampleRate / fftSize)

const stuff = []
const averageFrequencyWeights = weightsLists => {
    return weightsLists.reduce((acc, weights, i) => {
      return sumArrays(acc, Array.from(weights))
    }, Array.from(Array(fftSize / 2), () => 0)).map(el => el / weightsLists.length)
}

const sumArrays = (arr1, arr2) => arr1.map((el, idx) => el + arr2[idx])


const getFrequencyWeights = () => {
  const recordAudio = () => {
     if (!audio.paused) {
       // setTimeout(recordAudio, 0)
       requestAnimationFrame(recordAudio);
       analyser.getByteFrequencyData(frequencyData)
       stuff.push(frequencyData)
     }
  }
  audio.play()
  recordAudio()
};


const visualizeWaveForm = data => {
  const visualizer = document.getElementById("visualizer")
  for(let i = 0; i < (3000 / bandSize); i += 1) {
    const node = document.createElement("div")
    node.style.height = `${data[i]}px`
    node.id = `node-${i * bandSize}`
    visualizer.appendChild(node)
  }
}

const run = () => {
  getFrequencyWeights()
  let a = averageFrequencyWeights(stuff)
  visualizeWaveForm(a)
}


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

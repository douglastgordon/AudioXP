const audio = document.getElementById("player")
const recorderNode = document.getElementById("record")

const audioCtx = new AudioContext()
const audioSrc = audioCtx.createMediaElementSource(audio)
const analyser = audioCtx.createAnalyser()
const fftSize = 512
analyser.fftSize = fftSize
// analyser.smoothingTimeConstant = 0.2
audioSrc.connect(analyser)
audioSrc.connect(audioCtx.destination)

const bufferlength = analyser.frequencyBinCount
const frequencyData = new Uint8Array(bufferlength)
analyser.getByteFrequencyData(frequencyData)

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

// i = 240 2400

const sampleRate = audioCtx.sampleRate
const bandSize = (sampleRate / fftSize)

const averageFrequencyWeights = spectrogramData => {
    return spectrogramData.reduce((acc, weights, i) => {
      return sumArrays(acc, Array.from(weights))
    }, Array.from(Array(fftSize / 2), () => 0)).map(el => el / spectrogramData.length)
}

const sumArrays = (arr1, arr2) => arr1.map((el, idx) => el + arr2[idx])

// below works
const data = []
const getSpectrogram = () => {
  const recordAudio = () => {
     if (!audio.paused) {
       requestAnimationFrame(recordAudio) // bit of a hack
       analyser.getByteFrequencyData(frequencyData)
       data.push(Object.assign([], frequencyData))
     }
  }
  audio.play()
  recordAudio()
}
// above works




const getMaxIdx = arr => {
  return arr.reduce((acc, el, idx) => {
    const [currentMaxValue, currentMaxValueIndex] = acc
    return (el > currentMaxValue) ? [el, idx] : acc
  },[-Infinity, -1])[1]
}

const getLoudestFormant = averageFrequencyData => {
  const maxIdx = getMaxIdx(averageFrequencyData)
  return (maxIdx * bandSize) + (bandSize / 2)
}

const visualizeWaveForm = data => {
  const visualizer = document.getElementById("visualizer")
  for(let i = 0; i < (3000 / bandSize); i += 1) {
    const node = document.createElement("div")
    node.style.height = `${data[i]}px`
    node.id = `node-${i * bandSize}`
    visualizer.appendChild(node)
  }
}

const run = async () => {
  const spectrogramData = await getSpectrogram()
  const averageFrequencyData = averageFrequencyWeights(spectrogramData)
  console.log(averageFrequencyData)
  visualizeWaveForm(averageFrequencyData)
}

// const recorderNode = document.getElementById("record")

// define audio nodes
const ipaVowels = ["a", "ä", "ɑ", "ɒ", "ɐ", "æ", "ɛ", "œ", "ɜ", "ɞ", "ʌ", "ɔ"]
const ipaNodeIds = ipaVowels.map(ipaVowel => "ipa-" + ipaVowel)
const IPAnodes = ipaNodeIds.reduce((acc, nodeId) => {
  return Object.assign({}, acc, {[nodeId]: document.getElementById(nodeId)})
}, {})

const ipaNodes = document.getElementById("ipa-nodes")
ipaNodes.addEventListener("click", (e) => {
  e.target.children[0].play()
  console.log(e.currentTarget)
})
// const ɒ = document.getElementById("ipa-ɒ")
// const i = document.getElementById("ipa-i")


// create audio context
const audioCtx = new AudioContext()
const fftSize = 1024
const sampleRate = audioCtx.sampleRate
const bandSize = (sampleRate / fftSize)

// define analyser
const analyser = audioCtx.createAnalyser()
analyser.fftSize = fftSize
analyser.smoothingTimeConstant = 0.2

const averageFrequencyWeights = spectrogramData => {
    return spectrogramData.reduce((acc, weights, i) => {
      return sumArrays(acc, Array.from(weights))
    }, Array.from(Array(fftSize / 2), () => 0)).map(el => el / spectrogramData.length)
}

const lowPassFilter = (frequencyArray, cutoff=5000) => {
  return frequencyArray.slice(0, cutoff / bandSize)
}

const sumArrays = (arr1, arr2) => arr1.map((el, idx) => el + arr2[idx])

const getSpectrogram = async audioNode => {
  const audioSrc = audioCtx.createMediaElementSource(audioNode)
  audioSrc.connect(analyser)
  audioSrc.connect(audioCtx.destination)

  const bufferlength = analyser.frequencyBinCount
  const frequencyData = new Uint8Array(bufferlength)

  const data = []
  const recordAudio = () => {
     if (!audioNode.paused) {
       setTimeout(recordAudio, 2)
       analyser.getByteFrequencyData(frequencyData)
       data.push(Object.assign([], frequencyData))
     }
  }
  const play = audioNode => (
    new Promise((resolve, reject) => {
      audioNode.play()
      recordAudio()
      audioNode.onerror = reject
      audioNode.onended = resolve
   })
  )
  return play(audioNode).then(() => {
    audioSrc.disconnect()
    return data
  })
}

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
  const maxFrequency = 10000
  const visualizations = document.getElementById("visualizations")
  const visualization = document.createElement("div")
  visualization.classList.add("visualization")
  for(let i = 0; i < (maxFrequency / bandSize); i += 1) {
    const node = document.createElement("div")
    node.style.height = `${data[i]}px`
    node.id = `node-${i * bandSize}`
    visualization.appendChild(node)
  }
  visualizations.appendChild(visualization)
}

const getFrequencyAverage = async audioNode => {
  const spectrogramData = await getSpectrogram(audioNode)
  const frequencyArray = averageFrequencyWeights(spectrogramData)
  const lowPassFrequencyArray = lowPassFilter(frequencyArray)
  visualizeWaveForm(lowPassFrequencyArray)
  console.log(lowPassFrequencyArray)
  return lowPassFrequencyArray
}



// recorderNode.addEventListener("click", () => {
//   navigator.mediaDevices.getUserMedia({ audio: true }).then(record)
// })


const playClip = (e) => {
  console.log(e)
}

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


// compare to real ipa!!!!

const getComparisonScore = (arr1, arr2) => {
  return arr1.reduce((acc, el, idx) => {
    return acc + Math.abs(el - arr2[idx])
  }, 0) / arr1.length
}


// bat to a === 28

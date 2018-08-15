function frequencyToIndex(freq, fftSize, sampleRate = 44100) {
  let nyquist = sampleRate / 2;
  let fftBin = fftSize /2;

  let index = Math.round(freq / nyquist * fftSize)

  if(index <= 0) return 0
  if(index > fftBin) return fftBin
  return index
}

function byteFrequencyAverage(analyser, frequencies, minHz, maxHz, norm = 255) {
  let sampleRate = analyser.context.sampleRate
  let fftSize = analyser.fftSize

  let start = frequencyToIndex(minHz, fftSize, sampleRate)
  let end = frequencyToIndex(maxHz, fftSize, sampleRate)

  let count = end - start
  let sum = 0

  while(start < end) {
    sum += frequencies[start]
    start +=1
  }

  return count ? sum/count : 0
}

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

function clamp(val, min, max) {
  return min < max ?
    val < min ? min : val > max ? max : val :
    val < max ? max : val > min ? min : val
}

function random(len, clamp) {
  let val = Math.floor(Math.random() * Math.pow(10, len))
  return clamp ? val % clamp : val
}

function hertzFactor(sampleRate, fftSize) {
  return sampleRate / fftSize
}

function byteFrequencyAverage2(frequencies, sampleRate, fftSize) {
 /*
  *  1. Sub Lows 20-100
  *  2. Lows 100-250
  *  3. Low Mids 250 - 500
  *  4. Mids 500 - 1k
  *  5. High Mids 1k - 5k
  *  6. Highs 5k-10k
  *  7. Super Highs 10k-20k and above
  */

  let groups = {
    sublow: { value: 0, count: 0, scale: 0.4 },
    low: { value: 0, count: 0, scale: 0.5 },
    lowmid: { value: 0, count: 0, scale: 0.5 },
    mid: { value: 0, count: 0, scale: 1 },
    highmid: { value: 0, count: 0, scale: 1 },
    high: { value: 0, count: 0, scale: 1.2 },
    superhigh: { value: 0, count: 0, scale: 1 }
  }

  groups = frequencies.reduce((acc, freq, i) => {
    let hz = Math.round((i + 1) * hertzFactor(sampleRate, fftSize))

    if(hz < 100) {
      groups.sublow.value += freq
      groups.sublow.count += 1
    } else if(hz < 250) {
      groups.low.value += freq
      groups.low.count += 1
    } else if(hz < 500) {
      groups.lowmid.value += freq
      groups.lowmid.count += 1
    } else if(hz < 1000) {
      groups.mid.value += freq
      groups.mid.count += 1
    } else if(hz < 5000) {
      groups.highmid.value += freq
      groups.highmid.count += 1
    } else if(hz < 10000) {
      groups.high.value += freq
      groups.high.count += 1
    } else if(hz < 20000) {
      groups.superhigh.value += freq
      groups.superhigh.count += 1
    }

    return groups
  }, groups)

  Object.keys(groups).forEach(key => {
    groups[key].value = Math.round(groups[key].value / groups[key].count)
  })

  return groups
}

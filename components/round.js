var Round = (function(analyser, canvas, context) {
  const WIDTH = canvas.width
  const HEIGHT = canvas.height

  function withAudioDetails(dataArray, bufferLength) {
    return function draw() {
      let drawer = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray)

      // get frequency values from average
      // use the average value as radius to fill circle
      // have an array of colors to choose from
      // change opacity depending on radius, a lot
      context.fillStyle = 'rgb(0,0,0)';
      context.clearRect(0, 0, WIDTH, HEIGHT);
 
      let groupedFreq = byteFrequencyAverage2(dataArray, analyser.context.sampleRate, analyser.fftSize)
      let colors = { 
        sublow: "hsla(12, 82%, 80%, alfa)",
        low: "hsla(350, 74%, 72%, alfa)",
        lowmid: "hsla(338, 70%, 60%, alfa)",
        mid: "hsla(313, 48%, 44%, alfa)",
        highmid: "hsla(279, 61%, 37%, alfa)",
        high: "hsla(276, 62%, 28%, alfa)",
        superhigh: "hsla(277, 64%, 19%, alfa)"
      }

      let maxRad = HEIGHT / 2.5
      let [x, y] = [WIDTH / 2, HEIGHT / 2]

      Object.keys(groupedFreq).forEach(freq => {
        let scaledRad = Math.round(groupedFreq[freq].value * groupedFreq[freq].scale)
        let rad = clamp(scaledRad, 20, maxRad)
        let alfa = +(parseFloat(rad / maxRad).toFixed(1))
        
        context.beginPath();
        context.arc(x, y, rad, 0, 2 * Math.PI);
        if((rad / maxRad) >= 0.9) { 
          context.strokeStyle = colors[freq].replace('alfa', alfa)
          context.lineWidth = 2;
          context.stroke()
          context.fillStyle = colors[freq].replace('alfa', 0.2)
          context.fill()

        } else {
          context.fillStyle = colors[freq].replace('alfa', alfa)
          context.fill()
        }
      })

      return drawer
    }
  }
  
  return {
    withAudioDetails: withAudioDetails
  }
})

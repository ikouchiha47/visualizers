var Bars = (function (analyser, canvas, context) {
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  
  // https://www.teachmeaudio.com/mixing/techniques/audio-spectrum/
  let bands = {
    subbas: {
      from: 20,
      to: 250,
      scale: 0.4,
      color: {r: 255, g: 0, b: 255},
    },
    lowmid: {
      from: 251,
      to: 500,
      scale: 0.5,
      color: {r: 0, g: 233, b: 255},
    },
    mid: {
      from: 501,
      to: 2000,
      scale: 1,
      color: {r: 0, g: 36, b: 255},
    },
    mid2: {
      from: 2001,
      to: 2500,
      scale: 1.1,
      color:  {r: 0, g: 255, b: 64},
    },
    mid3: {
      from: 2501,
      to: 3000,
      scale: 1.2,
      color: {r: 212, g: 213, b: 0},//{r: 212, g: 213, b: 0},
    },
    uppermid: {
      from: 3001,
      to: 3500,
      scale: 1.1,
      color:  {r: 255, g: 90, b: 0} ,
    },
    uppermid2: {
      from: 3501,
      to: 4000,
      scale: 0.5,
      color: {r: 255, g: 15,  b: 0},
    },
    uppermid3: {
      from: 4001,
      to: 5000,
      scale: 0.5,
      color: {r: 255, g: 0,  b: 0}
    },
    presence: {
      from: 50001,
      to: 8000,
      scale: 0.2,
      color: {r: 255, g: 35, b: 0 }
    },
    presence2: {
      from: 80001,
      to: 12000,
      scale: 2,
      color: {r: 224, g: 0, b: 5 }// {r: 255, g: 0, b: 0},
    }
  }
  
  function withAudioDetails(dataArray, bufferLength) {
    return function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      context.fillStyle = 'rgb(0,0,0)';
      context.clearRect(0, 0, WIDTH, HEIGHT);
      
      let bandkeys = Object.keys(bands)
      let freqs = bandkeys
      .map(k => byteFrequencyAverage(analyser, dataArray, bands[k].from, bands[k].to))
      .map(Math.floor)
      
      let barWidth = 20;
      let x = 0;
      
      // barWidth = (WIDTH / bufferLength) * 2.5;
      // let barHeight;
      // x = 0;
      
      // for(let i = 0; i < bufferLength; i++) {
      //   barHeight = dataArray[i]/2;
        
      //   context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      //   context.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
        
      //   x += barWidth + 1;
      // }
    
    for (let i = 0, len = freqs.length; i < len; i++) {
      let b = bands[bandkeys[i]]
      let rgb = `rgb(${ Object.values(b.color).join(',') })`
      context.shadowBlur = 6;
      context.shadowColor = rgb
      context.fillStyle = rgb; //`rgb(${freqs[i] + 100}, 50, 50)`
      
      let heightSlice = 6
      let barHeight = freqs[i] * b.scale
      let totHeight = Math.floor(barHeight / heightSlice)
      for(let j = 0; j < totHeight; j++) {
        context.fillRect(x, HEIGHT - (j * 8), barWidth, -1 * heightSlice)
      }
      context.shadowBlur = 6
      context.shadowColor = `rgb(255, 255, 255)`
      context.fillStyle = `rgb(255, 255, 255)`
      context.fillRect(x, HEIGHT - (totHeight * 8), barWidth, -1 * heightSlice)
      
      x += barWidth + 6;
    }
  }
}

return {
  withAudioDetails: withAudioDetails
}
})


var Bars = (function (canvas) {
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let context = canvas.getContext('2d')
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioCtx.createAnalyser();

  let audio = document.querySelector("#soundcloud");
  // https://www.teachmeaudio.com/mixing/techniques/audio-spectrum/
  let bands = {
    subbas: {
      from: 20,
      to: 60,
      scale: 0.4
    },
    bass: {
      from: 61,
      to: 250,
      scale: 0.5
    },
    lowmid: {
      from: 251,
      to: 500,
      scale: 0.5
    },
    mid: {
      from: 501,
      to: 1000,
      scale: 1
    },
    mid2: {
      from: 1001,
      to: 2000,
      scale: 1.1
    },
    mid3: {
      from: 2001,
      to: 4000,
      scale: 1.2
    },
    uppermid: {
      from: 4001,
      to: 5000,
      scale: 1.1
    },
    presence: {
      from: 50001,
      to: 8000,
      scale: 1
    }
  }

  function initSource() {
    let dataArray = new Uint8Array();
    let bufferLength = 0;
    let source = audioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 1024;
    bufferLength = analyser.frequencyBinCount;

    dataArray = new Uint8Array(bufferLength);

    context.clearRect(0, 0, WIDTH, HEIGHT);
    return { dataArray: dataArray, bufferLength: bufferLength }
  }

  function withAudioDetails(dataArray, bufferLength) {
    return function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      context.fillStyle = 'rgb(0, 0, 0)';
      context.clearRect(0, 0, WIDTH, HEIGHT);

      let bandkeys = Object.keys(bands)
      let freqs = bandkeys
        .map(k => byteFrequencyAverage(analyser, dataArray, bands[k].from, bands[k].to))
        .map(Math.floor)

      let barWidth = 20;
      let x = 0;

      for (let i = 0; i < freqs.length; i++) {
        context.fillStyle = `rgb(${freqs[i] + 100}, 50, 50)`
        context.fillRect(x, HEIGHT, barWidth, -1 * freqs[i] * bands[bandkeys[i]].scale)

        x += barWidth + 1;
      }

      // let barWidth = (WIDTH / bufferLength) * 2.5;
      // let barHeight;
      // let x = 0;

      // for(let i = 0; i < bufferLength; i++) {
      //   barHeight = dataArray[i]/2;
      //   console.log(dataArray[i], i)

      //   context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      //   context.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      //   x += barWidth + 1;
      // }
    }
  }

  return {
    initSource: initSource,
    withAudioDetails: withAudioDetails
  }
})


const WIDTH = 500;
const HEIGHT = 300;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();

let audio = document.querySelector("#soundcloud");
let canvas = document.querySelector("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
let context = canvas.getContext('2d')
let dataArray  = new Uint8Array();
let bufferLength = 0;

function initSource() {
  let source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;

  console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);

  context.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    context.fillStyle = 'rgb(0, 0, 0)';
    context.clearRect(0, 0, WIDTH, HEIGHT);

    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]/2;
    
            context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            context.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
    
            x += barWidth + 1;
    }
}

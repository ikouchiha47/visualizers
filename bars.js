const WIDTH = 500;
const HEIGHT = 300;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();

let audio = document.querySelector("#soundcloud");
let canvas = document.querySelector("canvas");
let source = audioCtx.createMediaElementSource(audio);
canvas.width = WIDTH;
canvas.height = HEIGHT;
let context = canvas.getContext('2d')

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
let bufferLength = analyser.frequencyBinCount;

console.log(bufferLength);
let dataArray = new Uint8Array(bufferLength);

context.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    context.fillStyle = 'rgb(0, 0, 0)';
    context.clearRect(0, 0, WIDTH, HEIGHT);
    
}

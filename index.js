window.onload = function () {
    function getDataFromInput() {
        return document.querySelector("#audio_link").value;
    }
    
    function loadAudio() {
        let value = getDataFromInput()
        return getStreamUrl(value).then(url => {
            document.querySelector("#soundcloud").src = url
            return true;
        }).catch(e => {
            console.log(e);
        })
    }
    
    function displayBars(bars, data) {
        bars.withAudioDetails(data.dataArray, data.bufferLength)();
    }
    
    function getStreamUrl(value) {
        let url = `http://localhost:8000?url=${value}`
        return fetch(url).then(resp => resp.json()).then(data => data.url)
    }
    
    
    function initSource() {
        let audio = document.querySelector("#soundcloud");
        let dataArray = new Uint8Array();
        let bufferLength = 0;
        let source = audioCtx.createMediaElementSource(audio);
        
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        
        dataArray = new Uint8Array(bufferLength);
        
        context.clearRect(0, 0, 500, 300);
        return { dataArray: dataArray, bufferLength: bufferLength }
    }
    
    
    let canvas = document.querySelector("canvas");
    canvas.width = 500;
    canvas.height = 300;
    
    let context = canvas.getContext('2d')
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();
    
    let bars = Bars(analyser, canvas, context)
    let data = initSource();
    
    document.querySelector("#soundcloud").addEventListener('play', () => {
        displayBars(bars, data)
    })
}

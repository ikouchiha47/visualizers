window.onload = function() {
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

    function displayBars() {
      let canvas = document.querySelector("canvas");
      canvas.width = 500;
      canvas.height = 300;
      let bars = Bars(canvas)
      
      loadAudio().then(() => {
        let data = bars.initSource()
        bars.withAudioDetails(data.dataArray, data.bufferLength)();
      })
    }

    function getStreamUrl(value) {
        let url = `http://localhost:8000?url=${value}`
        return fetch(url).then(resp => resp.json()).then(data => data.url)
    }

    document.querySelector("#audio_link").addEventListener("blur", displayBars)
}

window.onload = function() {
    function getDataFromInput() {
        return document.querySelector("#audio_link").value;
    }

    function loadAudio() {
        let value = getDataFromInput()
        getStreamUrl(value).then(url => {
            document.querySelector("#soundcloud").src = url
        }).catch(e => {
            console.log(e);
        })
    }

    function getStreamUrl(value) {
        let url = `http://localhost:8000?url=${value}`
        return fetch(url).then(resp => resp.json()).then(data => data.url)
    }

    document.querySelector("#audio_link").addEventListener("blur", loadAudio)
}

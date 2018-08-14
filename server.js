const r = require('request')
const qs = require('querystring')
const { parse } = require('url')
const http = require('http')
const port = 8000
const applicationJson = {
    'Content-Type': 'application/json'
}
const clientID = 'dce5652caa1b66331903493735ddd64d'

function requestAsync(url) {
    return new Promise((res, rej) => {
        r({
            method: 'GET',
            url,
            headers:  applicationJson
        }, (err, resp, body) => {
            if(err) return rej(err);
            if(resp.statusCode >= 400) return rej(body)
            res(body)
        })
    })
}

function withRequest(request, url, funcToExecute) {
    return request(url).then(data => JSON.parse(data)).then(funcToExecute)
}

function resolveUriFromMetadata(data) {
    if(!data.streamable) throw Error("NOT_STREAMABLE");
    return data.uri
}

function resolveTrackData(data) {
    if(!data.stream_url) throw Error("NOT_STREAMABLE");
    return `${data.stream_url}?client_id=${clientID}`;
}

function resolverUrl(mediaUrl) {
    let query = {
        url: mediaUrl,
        client_id: clientID 
    }
    let queryString = qs.stringify(query)

    return `http://api.soundcloud.com/resolve.json?${queryString}`
}

function trackUrl(url) {
    return `${url}?client_id=${clientID}`
}

function getSoundCouldUrl(req) {
    let { query } = parse(req.url);
    let queryStr = qs.parse(query);
    return queryStr.url
}

const requestHandler = (req, resp) => {
    let url = getSoundCouldUrl(req);

    resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    withRequest(requestAsync, resolverUrl(url), resolveUriFromMetadata)
        .then(uri => withRequest(requestAsync, trackUrl(uri),  resolveTrackData))
        .then(data => {
            resp.writeHead(200, applicationJson);
            console.log(data)
            resp.write(JSON.stringify({url: data}));
            resp.end()
        }).catch(e => {
            resp.writeHead(500 ,applicationJson);
            resp.write(JSON.stringify({ error: e }));
            resp.end()
        })
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


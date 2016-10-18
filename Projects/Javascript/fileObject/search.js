function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('filelist').innerHTML += responseString;
}

function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyDvcnMIMHXfyQKdUndR1LUCDfyeZeweLtU');

    search();
}

function search() {
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: 'god called in sick today',
    });

    request.execute(onSearchResponse);
}

function onSearchResponse(response) {
    showResponse(response);
}

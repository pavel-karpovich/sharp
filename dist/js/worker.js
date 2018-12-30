onmessage = function (event) {
    let data = JSON.parse(event.data);
    if (data.index == -1) {

        close();

    }
    self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js');
    let result = self.hljs.highlightAuto(data.code);
    postMessage(JSON.stringify({
        result: result.value,
        index: data.index
    }));
}
(function (window) {

    if (!window.Reveal) {
        throw new Error('Reveal.js not found!');
    }

    Reveal.initialize({
        controls: true,
        controlsTutorial: true,
        controlsBackArrows: 'faded',
        progress: false,
        slideNumber: true,
        history: true,
        keyboard: true,
        center: true,
        touch: true,
        hideInactiveCursor: true,
        hideAddressBar: true,
        transition: 'slide', // none/fade/slide/convex/concave/zoom
    });
    Reveal.addEventListener('ready', function (event) {
        presentable.toc({
            framework: 'revealjs'
        });
    });

    window.addEventListener('load', function () {

        if (typeof (Worker) === undefined) {

            return false;

        }
        let codeBlocks = document.getElementsByTagName('code');
        if (codeBlocks) {

            let worker = new Worker(resolvePath('js/worker.js'));
            worker.onmessage = function (event) {

                let data = JSON.parse(event.data);
                codeBlocks[data.index].innerHTML = data.result;
                codeBlocks[data.index].classList.add('hljs');

            }
            for (let i = 0; i < codeBlocks.length; ++i) {

                worker.postMessage(JSON.stringify({
                    index: i,
                    code: codeBlocks[i].textContent
                }));

            }
            worker.postMessage(JSON.stringify({
                index: -1
            }));

        }

    });
})(window);
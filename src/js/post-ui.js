const allPre = document.querySelectorAll('.reveal pre');
for (const pre of allPre) {
  pre.dataset.preventSwipe = true;
}

const separators = document.querySelectorAll('.separator');
for (const sep of separators) {
    const parent = sep.parentElement;
    const left = parent.firstElementChild;
    const right = parent.lastElementChild;
    let maxWidth = 50;
    sep.addEventListener('mousedown', function(e) {
        function move(e) {
            maxWidth += e.movementX * 100 / parent.parentElement.offsetWidth;
            left.style.maxWidth = maxWidth + '%';
            right.style.maxWidth = (100 - maxWidth) + '%';
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', function up() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        });
    });
}
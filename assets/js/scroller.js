document.addEventListener("DOMContentLoaded", init);

window.onscroll = function() {
    fixedHeader();
}

function init() {
    fixedHeader();
}

function fixedHeader() {
    const pos = window.pageYOffset;
    const header = document.getElementById("header");

    if (pos>10)
        header.classList.add("header_detached");

    else
        header.classList.remove("header_detached");

        const offset_for_hide = document.getElementsByClassName("footer")[0].offsetTop-50

    if (pos > offset_for_hide)
        header.classList.add("is-hidden");
    else
        header.classList.remove("is-hidden");
}
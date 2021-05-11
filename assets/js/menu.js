document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu__open-button");
  menuButton.onclick = handleClick;

  const closeButton = document.querySelector(".menu__close-button");
  closeButton.onclick = handleClick;

  const menuElements = document.querySelectorAll(".menu__list > li");
  menuElements.forEach(function (element) {
    element.onclick = handleClick;
  });

  initClickOutside();
});

function handleClick() {
  const element = document.querySelector(".menu__wrapper");
  if (element.classList.contains("menu__wrapper_visible")) {
    close();
  } else {
    open();
  }
}

function initClickOutside() {
  document.addEventListener("click", function (event) {
    const element = document.querySelector("header");
    if (event.target !== element && !element.contains(event.target)) {
      close();
    }
  });
}

function open() {
  document.querySelector(".menu__wrapper").classList.replace("menu__wrapper_hidden", "menu__wrapper_visible");
}

function close() {
  document.querySelector(".menu__wrapper").classList.replace("menu__wrapper_visible", "menu__wrapper_hidden");
}

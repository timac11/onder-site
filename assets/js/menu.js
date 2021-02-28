document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu button");
  menuButton.onclick = handleClick;

  const menuElements = document.querySelectorAll(".menu__list > li");
  menuElements.forEach(function (element) {
    element.onclick = handleClick;
  });

  initClickOutside();
});

function handleClick() {
  const element = document.querySelector(".menu__list");
  if (element.classList.contains("menu__list_visible")) {
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
  document.querySelector(".menu__list").classList.replace("menu__list_hidden", "menu__list_visible");
}

function close() {
  document.querySelector(".menu__list").classList.replace("menu__list_visible", "menu__list_hidden");
}

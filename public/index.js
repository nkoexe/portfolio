const title_letters = document.querySelectorAll(".title_letter");

let current_menu_index = 0;
const navigation_container = document.querySelector("#navigation_container");
const navigation_buttons = document.querySelectorAll(".navigation_button");
const menu = document.querySelector("#menu");
const squiggle = document.querySelector("#navigation_buttons_underline_window");
const squiggle_svg = document.querySelector("#underline");
const pointer = document.querySelector("#pointer");

let mouseX = document.body.clientWidth / 2;
let mouseY = -10;
const pointerSpeed = 0.8;
let pointerX = mouseX;
let pointerY = mouseY;
let pointerWidth = 10;
let pointerHeight = 10;
const pointerPadding = 20;
let pointerHovering = false;
let hoveredElement = null;


// skip header and footer animations
if (document.documentElement.scrollTop > 0) {
  document.querySelector("header").style.animationDelay = "0.2s";
  document.querySelector("footer").style.animationDelay = "0.2s";
}

// Email
const email = document.querySelector("#email")
email.innerHTML = email.innerHTML.replace("[at]", "@")
email.href = "mailto:" + email.innerHTML

// LANGUAGE
function _setLang(language) {
  const tranlate_elements = document.querySelectorAll(`[data-${language}]`);
  tranlate_elements.forEach(element => {
    element.innerHTML = element.getAttribute(`data-${language}`);
  })
  setMenuHighlight(current_menu_index)
}
function setLang(language) {
  if (document.startViewTransition) {
    document.startViewTransition(function () {
      _setLang(language)
    })
  } else {
    _setLang(language)
  }
}
let init_lang = (navigator.language || navigator.userLanguage).split('-')[0];
if (!('en', 'de', 'it').includes(init_lang)) {
  init_lang = 'en';
}
setLang(init_lang);

document.querySelector("#button_language_en").onclick = () => { setLang('en') }
document.querySelector("#button_language_de").onclick = () => { setLang('de') }
document.querySelector("#button_language_it").onclick = () => { setLang('it') }

// MENU
document.querySelector("#menu_button").onclick = () => {
  menu.classList.toggle("open");
}

// TITLE ANIMATION ON HOVER
for (let i = 0; i < title_letters.length; i++) {
  title_letters[i].style.transitionDelay = `${i * 0.02}s`;
}

// POINTER
function animatePointer() {
  pointerX = mouseX - (mouseX - pointerX) * pointerSpeed;
  pointerY = mouseY - (mouseY - pointerY) * pointerSpeed;
  pointer.style.transform = `translate(${pointerX}px, ${pointerY}px)`;
  pointer.style.width = pointerWidth + "px";
  pointer.style.height = pointerHeight + "px";
  requestAnimationFrame(animatePointer);
}
animatePointer();

// check for pointer receiving objects (buttons)
document.onmousemove = (e) => {
  if (e.target.classList.contains("pointer_receiver")) {
    // new hover, or hovering different object
    if (!pointerHovering || hoveredElement != e.target) {
      hoveredElement = e.target;
      pointer.classList.add("hovering");
      const target = e.target.getBoundingClientRect();
      mouseX = target.left + target.width / 2;
      mouseY = target.top + target.height / 2;
      pointerWidth = target.width + pointerPadding;
      pointerHeight = target.height + pointerPadding;
      pointerHovering = true;
    }
    // else already hovering, do nothing
  } else if (pointerHovering) {
    // exit hovering state
    hoveredElement = null;
    pointer.classList.remove("hovering");
    pointerWidth = pointerHeight = 10;
    pointerHovering = false;
  } else {
    // regular movement
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
}

// NAVIGATION
let menu_scroll_thresholds
function generate_menu_scroll_thresholds() {
  const scroll_y = document.documentElement.scrollTop
  menu_scroll_thresholds = [
    0,
    scroll_y + document.querySelector("#bio").getBoundingClientRect().top,
    scroll_y + document.querySelector("#works_container").getBoundingClientRect().top,
    scroll_y + document.querySelector("#contact_container").getBoundingClientRect().top,
    scroll_y + document.querySelector("#info_container").getBoundingClientRect().top,
  ]
}
generate_menu_scroll_thresholds()

function setMenuHighlight(index) {
  current_menu_index = index
  const rect = navigation_buttons[index].getBoundingClientRect()

  const left = rect.left - navigation_container.getBoundingClientRect().left;

  squiggle.style.width = `${rect.width - 20}px`;
  squiggle.style.left = `${left + 10}px`;
  squiggle_svg.style.left = `-${left}px`;
}
setMenuHighlight(0);

window.onresize = (e) => {
  generate_menu_scroll_thresholds()
  setMenuHighlight(current_menu_index)
}

window.onfocus = (e) => {
  generate_menu_scroll_thresholds()
}

window.onscroll = (e) => {
  const currentY = document.documentElement.scrollTop + document.body.offsetHeight / 2
  for (let index = menu_scroll_thresholds.length - 1; index >= 0; index--) {
    // console.log("checking " + index + " (" + currentY + " " + menu_scroll_thresholds[index] + ")")
    if (currentY > menu_scroll_thresholds[index]) {
      setMenuHighlight(index)
      return
    }
  }
}

navigation_buttons[0].onclick = () => {
  document.documentElement.scroll({ top: 0, behavior: "smooth" })
  setMenuHighlight(0)
  menu.classList.remove("open")
}
navigation_buttons[1].onclick = () => {
  document.querySelector("#bio").scrollIntoView({ behavior: "smooth", block: "center" })
  setMenuHighlight(1)
  menu.classList.remove("open")
}
navigation_buttons[2].onclick = () => {
  document.querySelector("#works_container").scrollIntoView({ behavior: "smooth" })
  setMenuHighlight(2)
  menu.classList.remove("open")
}
navigation_buttons[3].onclick = () => {
  document.querySelector("#contact_container").scrollIntoView({ behavior: "smooth" })
  setMenuHighlight(3)
  menu.classList.remove("open")
}
navigation_buttons[4].onclick = () => {
  document.querySelector("#info_container").scrollIntoView({ behavior: "smooth" })
  setMenuHighlight(4)
  menu.classList.remove("open")
}

// REVEAL EFFECTS
const reveal_observer = new IntersectionObserver((elements) => {
  elements.forEach(element => {
    if (element.isIntersecting) {
      element.target.classList.add("visible");
    } else {
      element.target.classList.remove("visible");
    }
  });
}, { rootMargin: "-5% 0px -30% 0px" });

reveal_observer.observe(document.querySelector("#bio"));
reveal_observer.observe(document.querySelector("#works_container"));
reveal_observer.observe(document.querySelector("#contact_container"));
reveal_observer.observe(document.querySelector("#info_container"));

document.querySelectorAll(".project").forEach(project => {
  project.addEventListener("click", () => {
    // propagate event before handling
    setTimeout(() => {
      // if user is selecting text let's not close the panel
      if (window.getSelection().toString() === "") {
        project.classList.toggle("expanded")
      }
    }, 1);
  })
})
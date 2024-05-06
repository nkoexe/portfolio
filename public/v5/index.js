const theme_icon = document.querySelector("#change_theme_button");
const main_contaienr = document.querySelector("#main_container");
const title_element = document.querySelector("#title_container")
const title_letters = document.querySelectorAll(".title_letter");
const pages = document.querySelectorAll(".page");
let current_page_index = 0;
const navigation_container = document.querySelector("#navigation_container");
const navigation_buttons = document.querySelectorAll(".navigation_button");
const squiggle = document.querySelector("#navigation_buttons_underline_window");
const squiggle_svg = document.querySelector("#underline");
const pointer = document.querySelector("#pointer");

let mouseX = 0;
let mouseY = 0;
const pointerSpeed = 0.8;
let pointerX = 0;
let pointerY = 0;
let pointerWidth = 10;
let pointerHeight = 10;
let pointerHovering = false;
let hoveredElement = null;


// LIGHT&DARK THEME
function setTheme(dark) {
    if (dark) {
        document.body.dataset.theme = "dark";
        theme_icon.innerHTML = "dark_mode";
        // theme_icon.style.rotate = "360deg"
    }
    else {
        document.body.dataset.theme = "light";
        theme_icon.innerHTML = "light_mode"
        // theme1_icon.style.rotate = "180deg"
    }
}

if (window.matchMedia) {
    // watch for changes
    window.matchMedia('(prefers-color-scheme: dark)').onchange = ({ matches }) => {
        setTheme(matches);
    }
    // initial theme check
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

// header button
document.querySelector("#change_theme_button").onclick = () => {
    setTheme(document.body.dataset.theme == "light");
}

// LANGUAGE
function setLang(language) {
    const tranlate_elements = document.querySelectorAll(`[data-${language}]`);
    tranlate_elements.forEach(element => {
        element.innerHTML = element.getAttribute(`data-${language}`);
    })
}

document.querySelector("#button_language_en").onclick = () => { setLang('en') }
document.querySelector("#button_language_de").onclick = () => { setLang('de') }
document.querySelector("#button_language_it").onclick = () => { setLang('it') }


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
            pointerWidth = target.width;
            pointerHeight = target.height;
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
for (let i = 0; i < navigation_buttons.length; i++) {
    navigation_buttons[i].onclick = () => {
        setMenuHighlight(i);
    }
}

function setMenuHighlight(index) {
    const rect = navigation_buttons[index].getBoundingClientRect()

    const left = rect.left - navigation_container.getBoundingClientRect().left;

    squiggle.style.width = `${rect.width}px`;
    squiggle.style.left = `${left}px`;
    squiggle_svg.style.left = `-${left}px`;
}

// main_contaienr.onwheel = (e) => {
//     current_page = pages[current_page_index]
//     if (e.deltaY > 0) {
//         if (current_page_index == 4) { return }
//         setTimeout(() => {
//             current_page.classList.remove("active")
//         }, 500);
//         current_page_index += 1
//         pages[current_page_index].classList.add("active")
//         console.log(current_page_index)
//         is_scrolling = true;
//     } else {
//         if (current_page_index == 0) { return }
//         current_page.classList.add("fadeout")
//         setTimeout(() => {
//             current_page.classList.remove("fadeout")
//         }, 500);
//         current_page.classList.remove("active")
//         current_page_index -= 1
//         pages[current_page_index].classList.add("active")
//         console.log(current_page_index)
//     }

//     // main_contaienr.scrollTo(0, 0);
// }

// REVEAL EFFECTS
const observer = new IntersectionObserver((elements) => {

})
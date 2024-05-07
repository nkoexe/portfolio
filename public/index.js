const theme_icon = document.querySelector("#change_theme_button");
const title_letters = document.querySelectorAll(".title_letter");

let current_menu_index = 0;
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
        setTimeout(() => {
            theme_icon.innerHTML = "dark_mode";
        }, 100);
    }
    else {
        document.body.dataset.theme = "light";
        setTimeout(() => {
            theme_icon.innerHTML = "light_mode"
        }, 100);
    }

    // todo: change text when switching theme
    // todo: user select
    const style = getComputedStyle(document.body)
    console.log(style)
    document.querySelector("#color_tile_bg_text").innerHTML = style.getPropertyValue("--background-color")
    document.querySelector("#color_tile_fg_text").innerHTML = style.getPropertyValue("--text-color")
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
theme_icon.onclick = () => {
    setTheme(document.body.dataset.theme == "light");
}

// LANGUAGE
function setLang(language) {
    const tranlate_elements = document.querySelectorAll(`[data-${language}]`);
    tranlate_elements.forEach(element => {
        element.innerHTML = element.getAttribute(`data-${language}`);
    })
    setMenuHighlight(current_menu_index)
}
setLang("en");

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
let menu_scroll_thresholds
function generate_menu_scroll_thresholds() {
    menu_scroll_thresholds = [
        0,
        document.querySelector("#bio").getBoundingClientRect().top,
        document.querySelector("#works_container").getBoundingClientRect().top,
        document.querySelector("#info_container").getBoundingClientRect().top,
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

window.onscroll = (e) => {
    for (let index = menu_scroll_thresholds.length - 1; index >= 0; index--) {
        // console.log("checking " + index + " (" + window.scrollY + " " + menu_scroll_thresholds[index] + ")")
        if (window.scrollY + window.innerHeight / 2 > menu_scroll_thresholds[index]) {
            setMenuHighlight(index)
            return
        }
    }
}

navigation_buttons[0].onclick = () => {
    document.querySelector("#title_page").scrollIntoView({ behavior: "smooth" })
    setMenuHighlight(0)
}
navigation_buttons[1].onclick = () => {
    document.querySelector("#bio").scrollIntoView({ behavior: "smooth", block: "center" })
    setMenuHighlight(1)
}
navigation_buttons[2].onclick = () => {
    document.querySelector("#works_container").scrollIntoView({ behavior: "smooth" })
    setMenuHighlight(2)
}
navigation_buttons[4].onclick = () => {
    document.querySelector("#info_container").scrollIntoView({ behavior: "smooth" })
    setMenuHighlight(4)
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
reveal_observer.observe(document.querySelector("#info_container"));



const theme_icon = document.querySelector("#change_theme_button");
const dark_mode_icon = document.querySelector("#icon_dark_mode");
const light_mode_icon = document.querySelector("#icon_light_mode");
const title_letters = document.querySelectorAll(".title_letter");

let current_menu_index = 0;
const navigation_container = document.querySelector("#navigation_container");
const navigation_buttons = document.querySelectorAll(".navigation_button");
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


// RANDOMIZE COLORS
const randomize_colors_button = document.querySelector("#randomize_colors_button")
const randomize_colors_icon = document.querySelector("#randomize_colors_icon")

function randomizeColors() {
    let bg_luminosity, bg_saturation, text_luminosity, icon_luminosity
    if (document.body.dataset.theme == "dark") {
        bg_luminosity = 10
        bg_saturation = 3
        text_luminosity = 90
        icon_luminosity = 80
    } else {
        bg_luminosity = 95
        bg_saturation = 40
        text_luminosity = 10
        icon_luminosity = 40
    }

    bg_saturation = Math.round(Math.random() * bg_saturation) + 5
    const text_saturation = Math.round(Math.random() * 30) + 20
    const icon_saturation = Math.round(Math.random() * 60) + 40

    const bg_hue = Math.round(Math.random() * 360)
    const text_hue = bg_hue + Math.round(Math.random() * 80) - 40
    const icon_hue = bg_hue + Math.round(Math.random() * 150) - 75

    let bg = hslToHex(bg_hue, bg_saturation, bg_luminosity)
    let text = hslToHex(text_hue, text_saturation, text_luminosity)
    let icon = hslToHex(icon_hue, icon_saturation, icon_luminosity)

    document.body.style.setProperty("--background-color", bg)
    document.body.style.setProperty("--text-color", text)
    document.body.style.setProperty("--icon-color", icon)

    randomize_colors_icon.style.animation = 'none';
    randomize_colors_icon.offsetHeight; /* trigger reflow and restart animation */
    randomize_colors_icon.style.animation = null;

    updateColorTiles()
}

function updateColorTiles() {
    const style = getComputedStyle(document.body);
    document.querySelector("#color_tile_bg_code").innerHTML = style.getPropertyValue("--background-color");
    document.querySelector("#color_tile_text_code").innerHTML = style.getPropertyValue("--text-color");
    document.querySelector("#color_tile_accent_code").innerHTML = style.getPropertyValue("--icon-color");
}

function hslToHex(h, s, l) {
    l /= 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - (s * Math.min(l, 1 - l) / 100) * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

randomize_colors_button.onclick = randomizeColors


// LIGHT&DARK THEME
function setTheme(dark) {
    if (dark) {
        document.body.dataset.theme = "dark";
        setTimeout(() => {
            dark_mode_icon.style.display = "";
            light_mode_icon.style.display = "none";
        }, 400);
    }
    else {
        document.body.dataset.theme = "light";
        setTimeout(() => {
            dark_mode_icon.style.display = "none";
            light_mode_icon.style.display = "";
        }, 400);
    }

    randomizeColors()
}

if (window.matchMedia) {
    // watch for changes
    window.matchMedia('(prefers-color-scheme: dark)').onchange = ({ matches }) => {
        setTheme(matches);
    }
    // initial theme check
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

// header button for changing theme
theme_icon.onclick = () => {
    // switch theme
    setTheme(document.body.dataset.theme == "light");
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

// for (let index = 1; index < navigation_buttons.length; index++) {
//     navigation_buttons[index].onclick = () => {
//         document.documentElement.scroll({ top: menu_scroll_thresholds[index] + document.body.offsetHeight / 2, behavior: "smooth" })
//         setMenuHighlight(index)
//     }
// }

navigation_buttons[0].onclick = () => {
    document.documentElement.scroll({ top: 0, behavior: "smooth" })
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
navigation_buttons[3].onclick = () => {
    document.querySelector("#contact_container").scrollIntoView({ behavior: "smooth" })
    setMenuHighlight(3)
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
reveal_observer.observe(document.querySelector("#contact_container"));
reveal_observer.observe(document.querySelector("#info_container"));

document.querySelectorAll(".project").forEach(project => {
    project.addEventListener("click", () => {
        project.classList.toggle("expanded")
    })
})
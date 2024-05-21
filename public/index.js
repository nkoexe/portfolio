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
const pointerPadding = 20;
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

    const style = getComputedStyle(document.body);
    document.querySelector("#color_tile_bg_code").innerHTML = style.getPropertyValue("--background-color");
    document.querySelector("#color_tile_text_code").innerHTML = style.getPropertyValue("--text-color");
    document.querySelector("#color_tile_accent_code").innerHTML = style.getPropertyValue("--icon-color");
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

// Email
const email = document.querySelector("#email")
email.innerHTML = email.innerHTML.replace("[at]", "@")
email.href = "mailto:" + email.innerHTML

// randomize colors
document.querySelector("#randomize_colors_button").onclick = () => {
    let bg_luminosity, text_luminosity, icon_luminosity
    if (document.body.dataset.theme == "dark") {
        bg_luminosity = 10
        text_luminosity = 90
        icon_luminosity = 80
    } else {
        bg_luminosity = 95
        text_luminosity = 10
        icon_luminosity = 40
    }

    const bg_saturation = Math.round(Math.random() * 20) + 5
    const text_saturation = Math.round(Math.random() * 30) + 20
    const icon_saturation = Math.round(Math.random() * 60) + 40

    const bg_hue = Math.round(Math.random() * 360)
    const text_hue = bg_hue + Math.round(Math.random() * 80) - 40
    const icon_hue = bg_hue + Math.round(Math.random() * 100) - 50

    let bg = `hsl(${bg_hue}deg, ${bg_saturation}%, ${bg_luminosity}%)`
    let text = `hsl(${text_hue}deg, ${text_saturation}%, ${(text_luminosity)}%)`
    let icon = `hsl(${icon_hue}deg, ${icon_saturation}%, ${(icon_luminosity)}%)`

    document.body.style.setProperty("--background-color", bg)
    document.body.style.setProperty("--text-color", text)
    document.body.style.setProperty("--icon-color", icon)
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
    menu_scroll_thresholds = [
        0,
        document.querySelector("#bio").getBoundingClientRect().top,
        document.querySelector("#works_container").getBoundingClientRect().top,
        document.querySelector("#contact_container").getBoundingClientRect().top,
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
    const currentY = document.documentElement.scrollTop + document.body.offsetHeight / 2
    for (let index = menu_scroll_thresholds.length - 1; index >= 0; index--) {
        // console.log("checking " + index + " (" + window.scrollY + " " + menu_scroll_thresholds[index] + ")")
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



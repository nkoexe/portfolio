let root = document.documentElement;
let darkmodeicon = document.getElementById("darkmodebtn");

let darkmode = false;
let darkcolors = ["#141414", '#d44d5c', '#f7ebe8']
let lightcolors = ["#f1f2eb", "#a4c2a5", "#1b1b1b"]

function darkmodeswitch() {
    if (darkmode) {
        root.style.setProperty('--color-background1', lightcolors[0]);
        root.style.setProperty('--color-background2', lightcolors[1]);
        root.style.setProperty('--color-text', lightcolors[2]);
        darkmodeicon.innerText = "dark_mode";
        darkmode = false;
    } else {
        root.style.setProperty('--color-background1', darkcolors[0]);
        root.style.setProperty('--color-background2', darkcolors[1]);
        root.style.setProperty('--color-text', darkcolors[2]);
        darkmodeicon.innerText = "light_mode";
        darkmode = true;
    }
}

function ScrollTo(element_id) {
    document.getElementById(element_id).scrollIntoView({behavior: "smooth"})
}

darkmodeswitch()
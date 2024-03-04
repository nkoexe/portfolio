const cube = document.getElementById('parallax-root');
let xfactor, yfactor = 0


const onMouseMove = (e) => {
    xfactor = (e.pageX / window.innerWidth) * 20 - 10;
    yfactor = - (e.pageY / window.innerHeight) * 20 + 10;

    cube.style.transform = `rotateX(${yfactor}deg) rotateY(${xfactor}deg)`;
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onMouseMove);  // ?
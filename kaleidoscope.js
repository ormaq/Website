let page2 = function (p) {
  // kaleidoscope
  let symmetry = 6;
  let angle = 360 / symmetry;

  p.windowResized = function () {
    let container = document.getElementById("interactive2");
    p.resizeCanvas(container.clientWidth, container.clientHeight);
    // instead of offsetWidth and offsetHeight, use windowWidth and windowHeight
    p.background(127);
  };

  p.setup = function () {
    let container = document.getElementById("interactive2");
    let renderer = p.createCanvas(container.clientWidth, container.clientHeight);
    renderer.parent("interactive2");
    p.resizeCanvas(container.clientWidth, container.clientHeight);
    
    // kaleidoscope
    p.angleMode(p.DEGREES);
    p.background(127);
  };

  p.draw = function () {
    p.translate(p.width / 2, p.height / 2);

    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      let mx = p.mouseX - p.width / 2;
      let my = p.mouseY - p.height / 2;
      let pmx = p.pmouseX - p.width / 2;
      let pmy = p.pmouseY - p.height / 2;

      if (p.mouseIsPressed) {
        for (let i = 0; i < symmetry; i++) {
          p.rotate(angle);
          let sw = 3;
          p.strokeWeight(sw);
          p.line(mx, my, pmx, pmy);
          p.push();
          p.scale(1, -1);
          p.line(mx, my, pmx, pmy);
          p.pop();
        }
      }
    }
  };

};
window.addEventListener('DOMContentLoaded', () => {
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  if (windowWidth / windowHeight <= 1.1) {
  } else {
    let backgroundpage2 = new p5(page2);
  }
});

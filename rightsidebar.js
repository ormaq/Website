let rightSideBar = function (p) {
  let movers = [];
  let liquid;
  let onscreen = 0;
  let colors = [
    '#FF2744',
    '#D32F2F',
    '#c62828',
    '#faa613',
    '#ffa531',
    '#ff6700',
    '#FF9F00',
    '#FFC107',
    '#FFE04D',
    '#FFEB3B',
    '#FFED71',
    '#C6DBFD',
    '#2196F3',
    '#2656A7',
    '#311b92',
  ];
  p.setup = function () {

    let container = document.getElementById("diagram");
    let renderer = p.createCanvas(container.offsetWidth, container.offsetHeight * .9);
    renderer.parent("diagram");
    liquid = new Liquid(0, p.height / 8, p.width, p.height / 2, 0.1);
  };

  p.windowResized = function () {
    let container = document.getElementById("diagram");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };

  p.draw = function () {


    if (onscreen > 0)
      p.clear();
    for (let i = 0; i < movers.length; i++) {
      if (liquid.contains(movers[i])) {
        let dragForce = liquid.calculateDrag(movers[i]);
        movers[i].applyForce(dragForce);
      }

      let gravity = p.createVector(0, 0.1 * movers[i].mass);
      movers[i].applyForce(gravity);

      movers[i].update();
      movers[i].display();
      if (movers[i].position.y > p.height) {
        movers.splice(i, 1);
        onscreen--;
      }
    }
  };

  p.mousePressed = function () {
    // if within canvas
    if (p.mouseX < p.width && p.mouseX > 0 && p.mouseY < p.height && p.mouseY > 0)
      for (let i = 0; i < 9; i++) {
        let randompos = p.random(-10, 10);
        movers.push(new Mover(p.random(0.4, 1.5), randompos + 20 + i * 25, 20 + randompos));
        onscreen++;
      }
  };

  let Liquid = function (x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  };

  Liquid.prototype.contains = function (m) {
    let l = m.position;
    return l.x > this.x && l.x < this.x + this.w &&
      l.y > this.y && l.y < this.y + this.h;
  };

  Liquid.prototype.calculateDrag = function (m) {
    let speed = m.velocity.mag();
    let dragMagnitude = this.c * speed * speed;
    let dragForce = m.velocity.copy();
    dragForce.mult(-1);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
  };

  Liquid.prototype.display = function () {
    p.noStroke();
    p.fill(200);
    p.rect(this.x, this.y, this.w, this.h);
  };

  let Mover = function (m, x, y) {
    this.mass = m;
    this.position = p.createVector(x, y);
    this.velocity = p.createVector(0, 0);
    this.acceleration = p.createVector(0, 0);
    this.color = colors[Math.floor(Math.random() * colors.length)]; // Random color from the list
  };

  Mover.prototype.applyForce = function (force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  };

  Mover.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  Mover.prototype.display = function () {
    p.stroke(0);
    p.strokeWeight(0);
    p.fill(this.color); // Use the assigned color
    p.ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
  };
};

window.addEventListener('DOMContentLoaded', () => {
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  if (windowWidth / windowHeight <= 1.1) {
  } else {
    let rsidebar = new p5(rightSideBar);
  }
});
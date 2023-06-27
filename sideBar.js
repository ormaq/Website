let sidebar = function (p) {
  // Button class
  class Button {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.originalX = x;
      this.originalY = y;
      this.speedX = p.random(-0.1, 0.1);
      this.speedY = p.random(-0.1, 0.1);
      this.offscreentime = 0;
      this.clicked = false;
      this.hovered = false;
      this.scale = 1;
    }

    onClick() {
      currentSection = buttons.indexOf(this);
      window.updateCurrentSection(currentSection);
    }

    update() {
      if (
        p.mouseX >= this.x &&
        p.mouseX <= this.x + this.size * 3 &&
        p.mouseY >= this.y &&
        p.mouseY <= this.y + this.size / 1.2 &&
        p.mouseIsPressed
      ) {
        if (!this.clicked) {
          this.onClick();
          this.clicked = true;
        }
      } else {
        this.clicked = false;
      }

      if (
        p.mouseX >= this.x &&
        p.mouseX <= this.x + this.size * 3 &&
        p.mouseY >= this.y &&
        p.mouseY <= this.y + this.size / 1.2
      ) {
        this.hovered = true;
      } else {
        this.hovered = false;
      }

      if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
        this.offscreentime = 0;
        this.x = p.lerp(this.x, this.originalX, 0.1);
        this.y = p.lerp(this.y, this.originalY, 0.1);
        this.speedX = p.random(-0.1, 0.1);
        this.speedY = p.random(-0.1, 0.1);
      } else {
        this.offscreentime++;
        if (this.offscreentime > 400) {
          this.x += this.speedX;
          this.y += this.speedY;
        }

        if (
          this.x < -this.size ||
          this.x > p.width ||
          this.y < -this.size ||
          this.y > p.height
        ) {
          if (p.random(1) < 0.5) {
            this.speedX *= -1;
          } else {
            this.speedY *= -1;
          }
        }
      }
    }

    display(i) {
      const targetSize = this.hovered ? this.size * 1.2 : this.size;
      const scaleSpeed = 0.2;

      this.scale = p.lerp(this.scale, targetSize / this.size, scaleSpeed);

      const scaledSize = this.size * this.scale;
      const xPos = this.x - (scaledSize - this.size) / 2;
      const yPos = this.y - (scaledSize / 1.4 - this.size / 1.4) / 2;

      if (buttons.indexOf(this) === currentSection) {
        p.fill(200, fadetimer);
      } else {
        p.fill(220, fadetimer);
      }
      p.strokeWeight(0);
      p.rect(xPos, yPos, scaledSize * 4, scaledSize / 1.4, 20);

      p.fill(100, fadetimer);
      p.textSize(20);
      p.textAlign(p.CENTER, p.CENTER);
      // first one says "Home"
      if (i == 0)
        p.text("Home", xPos + scaledSize, yPos + scaledSize / 1.4 / 2);
      // second one says "About"
      else if (i == 1)
        p.text("Create", xPos + scaledSize, yPos + scaledSize / 1.4 / 2);
      // third one says "Projects"
      else if (i == 2)
        p.text("Interact", xPos + scaledSize, yPos + scaledSize / 1.4 / 2);
      // fourth one says "Contact"
      else if (i == 3)
        p.text("Contact", xPos + scaledSize, yPos + scaledSize / 1.4 / 2);
    }
  }

  // Array to hold buttons
  let buttons = [];
  let currentSection = 0;
  let fadetimer = 0;
  let mobile = false;

  p.setup = function () {
    if (p.windowWidth / p.windowHeight <= 1.1) {
      mobile = true;
    }

    let container = document.getElementById("sidebar");
    let renderer = p.createCanvas(container.offsetWidth, container.offsetHeight * .9);
    renderer.parent("sidebar");
    p.background(0, 0, 0, 0);
    for (let i = 0; i < 4; i++) {
      buttons.push(new Button(p.windowWidth * 0.02, p.windowHeight * 0.05 + i * 100, 50));
    }
  };

  p.windowResized = function () {
    let container = document.getElementById("sidebar");
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);

  };

  p.draw = function () {
    if (mobile)
      return;


    if (currentSection === 0) {
      if (fadetimer > 0) {
        fadetimer -= 5;
      }
      else
        return;
    }
    if (currentSection != 0 && fadetimer < 220) {
      fadetimer += 5;
    }
    p.clear();
    for (let i = 0; i < buttons.length; i++) {
      console.log("bill");
      buttons[i].update();
      buttons[i].display(i);
    }
  };

  window.setCurrentSection = function (section) {
    currentSection = section;
  };
};

let leftsidebar = new p5(sidebar);

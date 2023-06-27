let tower = function (p) {
    let dominoes, balls, gap, maxY, towerHeight;
    let resetting = false;
    let blackHole = false;
    let clickx, clicky;

    p.windowResized = function () {
        let container = document.getElementById("interactive3");
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };

    p.setup = function () {
        // screen size
        let container = document.getElementById("interactive3");
        let renderer = p.createCanvas(container.offsetWidth, container.offsetHeight);
        renderer.parent("interactive3");
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);

        p.world.gravity.y = 10;

        p.noStroke();

        balls = new p.Group();
        balls.d = 20;

        dominoes = new p.Group();
        dominoes.w = 5;
        dominoes.h = 19;
        dominoes.mass = 0.01;
        gap = 10;

        maxY = 350;

        towerHeight = dominoes.w + dominoes.h + 2;

        // not this
        let floorY = tower(p.width / 2.15, 200, true);
        // instead make it the center of the screen

        let floor = new p.Sprite([[0, floorY], [p.width, floorY]], "static");
        // dont render the floor
        floor.visible = false;

        // Handle right-click to create a black hole
        p.canvas.oncontextmenu = function (e) {
            blackHole = !blackHole;
            clickx = p.mouseX;
            clicky = p.mouseY;
        };
    };

    function tower(x, y, isLast) {
        new dominoes.Sprite(x, y - 13).rotation = 90;
        new dominoes.Sprite(x - gap, y);
        if (isLast) new dominoes.Sprite(x + gap, y);

        y += towerHeight;
        if (y > maxY) return y - dominoes.h + 2;

        tower(x - gap, y, false);
        if (isLast) return tower(x + gap, y, isLast);
    }

    function checkDominoes() {
        // check if dominoes have fallen
        if (!resetting) {
            const dominoesLen = dominoes.length;
            let totalfallen = 0;
            const threshold = dominoesLen * 0.8;

            for (let i = 0; i < dominoesLen; i++) {
                // or if off the screen only for x
                if (dominoes[i].position.x < -10 || dominoes[i].position.x > p.width + 10) {
                    totalfallen++;
                }
                // Break loop early when fallen dominoes reach 80%
                if (totalfallen >= threshold) {
                    break;
                }
            }

            // if totalfallen is 80% or more of dominoes, reset after 3 seconds
            if (totalfallen >= threshold) {
                resetting = true;
                setTimeout(() => {
                    balls.removeAll();
                    dominoes.removeAll();
                    tower(p.width / 2, 200, true);
                    resetting = false;
                    blackHole = false;
                }, 3000);
            }
        }
    }

    p.mousePressed = function () {
        // if within canvas
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {

            // if right click, create black hole
            if (p.mouseButton === p.RIGHT) {
                createBlackHole(p.mouseX, p.mouseY);
            } else {
                new balls.Sprite(p.mouseX, p.mouseY);
            }
        }

    };
    p.mouseDragged = function () {
        // if within canvas
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            balls.at(-1).moveTowards(p.mouse, 0.2);
        }
    };

    p.draw = function () {
        p.clear();
        if (blackHole) {
            // draw a black hole
            p.fill(0);
            p.circle(clickx, clicky, 10);
            // move all balls towards the black hole
            balls.forEach((ball) => ball.moveTowards(p.createVector(clickx, clicky), 0.05));
            dominoes.forEach((domino) => domino.moveTowards(p.createVector(clickx, clicky), 0.05));
        }

        // check if dominoes have fallen once every second
        if (p.frameCount % 60 === 0) {
            checkDominoes();
        }
    };
};

window.addEventListener('DOMContentLoaded', () => {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (windowWidth / windowHeight <= 1.1) {
    } else {
        let dominotower = new p5(tower);
    }
});


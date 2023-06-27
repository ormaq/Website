let flocking = function (p) {
    let flock;
    let mobile = false;
    p.windowResized = function () {
        let container = document.getElementById("interactive4");
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
    p.setup = function () {
        if (p.windowWidth / p.windowHeight <= 1.1) {
            mobile = true;
        }

        // frame rate 30
        p.frameRate(30);
        let container = document.getElementById("interactive4");
        let renderer = p.createCanvas(container.offsetWidth, container.offsetHeight);
        renderer.parent("interactive4");
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);

        flock = new Flock();
        // Add an initial set of boids into the system
        let birds = 50;
        if (mobile)
            birds = 20;
        for (let i = 0; i < birds; i++) {
            let b = new Boid(p.width / 2, p.height / 2);
            flock.addBoid(b);
        }
    };

    p.draw = function () {
        p.fill(127);
        p.stroke(200);
        p.clear();
        flock.run();
    };

    p.mouseDragged = function () {
        // Add a new boid into the System
        // if within the canvas
        if (p.mouseX < p.width && p.mouseX > 0 && p.mouseY < p.height && p.mouseY > 0)
            flock.addBoid(new Boid(p.mouseX, p.mouseY));
    };

    function Flock() {
        // An array for all the boids
        this.boids = []; // Initialize the array
    }

    Flock.prototype.run = function () {
        for (let i = 0; i < this.boids.length; i++) {
            this.boids[i].run(); // Passing the entire list of boids to each boid individually
        }
    };

    Flock.prototype.addBoid = function (b) {
        this.boids.push(b);
    };

    class Boid {
        constructor(x, y) {
            this.acceleration = p.createVector(0, 0);
            this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.position = p.createVector(x, y);
            this.r = 3.0;
            this.maxspeed = 3; // Maximum speed
            this.maxforce = 0.05; // Maximum steering force
        }
        run() {
            this.flock();
            this.update();
            this.borders();
            this.render();
        }
        applyForce(force) {
            // We could add mass here if we want A = F / M
            this.acceleration.add(force);
        }
        // We accumulate a new acceleration each time based on three rules
        flock() {
            let [sepr, alir, cohr] = this.sepalicoh(flock.boids);
            let sep = sepr; // Separation
            let ali = alir; // Alignment
            let coh = cohr; // Cohesion

            // Arbitrarily weight these forces
            sep.x *= 1.5;
            sep.y *= 1.5;

            ali.x *= 1.0;
            ali.y *= 1.0;

            coh.x *= 1.0;
            coh.y *= 1.0;

            // Add the force vectors to acceleration
            this.applyForce(sep);
            this.applyForce(ali);
            this.applyForce(coh);
        }
        // Method to update location
        update() {
            // Update velocity
            this.velocity.add(this.acceleration);
            // Limit speed
            this.velocity.limit(this.maxspeed);
            this.position.add(this.velocity);
            // Reset acceleration to 0 each cycle
            this.acceleration.mult(0);
        }
        // A method that calculates and applies a steering force towards a target
        // STEER = DESIRED MINUS VELOCITY
        seek(target) {
            let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
            // Normalize desired and scale to maximum speed
            desired.normalize();
            desired.mult(this.maxspeed);
            // Steering = Desired minus Velocity
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce); // Limit to maximum steering force
            return steer;
        }
        render() {
            // Draw a triangle rotated in the direction of velocity
            let theta = this.velocity.heading() + p.radians(90);
            p.push();
            p.translate(this.position.x, this.position.y);
            p.rotate(theta);
            p.beginShape();
            p.vertex(0, -this.r * 2);
            p.vertex(-this.r, this.r * 2);
            p.vertex(this.r, this.r * 2);
            p.endShape(p.CLOSE);
            p.pop();
        }
        // Wraparound
        borders() {
            const width = p.width;
            const height = p.height;

            this.position.x = (this.position.x + width) % width;
            this.position.y = (this.position.y + height) % height;
        }
        // Separation // Alignment // Cohesion
        sepalicoh(boids) {
            let desiredseparation = 25.0;
            let steer = p.createVector(0, 0);
            let sum = p.createVector(0, 0);
            let sumcoh = p.createVector(0, 0);

            let count = 0;
            let countallign = 0;
            let countcoh = 0;

            let neighbordist = 50;
            let neighbordistcoh = 50;
            let d;

            let totalBoids = boids.length;

            for (let i = 0; i < totalBoids; i++) {
                let diff = p5.Vector.sub(this.position, boids[i].position);
                d = diff.mag();

                if (d > 0) {
                    // Separation
                    if (d < desiredseparation) {
                        diff.div(d);
                        steer.add(diff);
                        count++;
                    }

                    // Alignment
                    if (d < neighbordist) {
                        sum.add(boids[i].velocity);
                        countallign++;
                    }

                    // Cohesion
                    if (d < neighbordistcoh) {
                        sumcoh.add(boids[i].position);
                        countcoh++;
                    }
                }
            }

            if (count > 0) {
                steer.div(count);
                if (steer.magSq() > 0) { // use magSq() instead of mag() to avoid costly square root computation
                    steer.normalize();
                    steer.mult(this.maxspeed);
                    steer.sub(this.velocity);
                    steer.limit(this.maxforce);
                }
            }

            let steer2;
            if (countallign > 0) {
                sum.div(countallign);
                sum.normalize();
                sum.mult(this.maxspeed);
                steer2 = p5.Vector.sub(sum, this.velocity);
                steer2.limit(this.maxforce);
            } else {
                steer2 = p.createVector(0, 0);
            }

            if (countcoh > 0) {
                sumcoh.div(countcoh);
                sumcoh = this.seek(sumcoh);
            } else {
                sumcoh = p.createVector(0, 0);
            }

            return [steer, steer2, sumcoh];
        }


    }


};

let flockingcontact = new p5(flocking);

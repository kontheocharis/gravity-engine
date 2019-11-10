var Particle = (function () {
    function Particle(radius, position, velocity) {
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = createVector(0, 0);
        this.mass = 4 / 3 * PI * this.radius * this.radius * this.radius;
    }
    return Particle;
}());
var particles;
var bigG = 20;
var sunRadius = 75;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    particles = [
        new Particle(sunRadius, createVector(0, 0), createVector(0, 0)),
    ];
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function unitDifference(a, b) {
    var diff = p5.Vector.sub(b, a);
    return p5.Vector.div(diff, p5.Vector.mag(diff));
}
function mousePressed() {
    var posX = mouseX - windowWidth / 2;
    var posY = mouseY - windowHeight / 2;
    particles.push(new Particle(random(5, 15), createVector(posX, posY), p5.Vector.fromAngle(-atan2(posX, posY), sqrt(bigG * particles[0].mass / p5.Vector.dist(particles[0].position, createVector(posX, posY))))));
}
function draw() {
    background(0);
    fill(225, 200, 30);
    for (var _i = 0, particles_1 = particles; _i < particles_1.length; _i++) {
        var particle = particles_1[_i];
        circle(particle.position.x, particle.position.y, particle.radius);
    }
    calculatePhysics();
}
function calculatePhysics() {
    if (particles.length > 1) {
        var _loop_1 = function (particle) {
            var lastAcceleration = particle.acceleration;
            particle.position.add(p5.Vector.add(p5.Vector.mult(particle.velocity, deltaTime / 1000), p5.Vector.mult(lastAcceleration, 0.5 * sq(deltaTime / 1000))));
            particle.acceleration = particles
                .filter(function (p) { return p != particle; })
                .map(function (p) { return p5.Vector.mult(unitDifference(particle.position, p.position), p.mass * bigG / (sq(p5.Vector.dist(p.position, particle.position)))); })
                .reduce(function (a, b) { return p5.Vector.add(a, b); });
            var avgAcceleration = p5.Vector.add(lastAcceleration, particle.acceleration).div(2);
            particle.velocity.add(p5.Vector.mult(avgAcceleration, deltaTime / 1000));
        };
        for (var _i = 0, particles_2 = particles; _i < particles_2.length; _i++) {
            var particle = particles_2[_i];
            _loop_1(particle);
        }
    }
}
function wrapParticle(particle) {
    if (particle.position.x > windowWidth / 2) {
        particle.position.x = particle.position.x - windowWidth;
    }
    else if (particle.position.x < -windowWidth / 2) {
        particle.position.x = particle.position.x + windowWidth;
    }
    if (particle.position.y > windowHeight / 2) {
        particle.position.y = particle.position.y - windowHeight;
    }
    else if (particle.position.y < -windowHeight / 2) {
        particle.position.y = particle.position.y + windowHeight;
    }
}
//# sourceMappingURL=build.js.map
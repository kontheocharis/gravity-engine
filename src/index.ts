class Particle
{
    public acceleration: p5.Vector = createVector(0,0);
    public mass: number;

    constructor(
        public radius: number,
        public position: p5.Vector,
        public velocity: p5.Vector,
    ) { 
        this.mass = 4/3 * PI * this.radius * this.radius * this.radius;
    }
}

let particles: Particle[];

const bigG = 20;
const sunRadius = 75;

function setup(): void {
    createCanvas(windowWidth, windowHeight, WEBGL);
    particles = [
        new Particle(sunRadius, createVector(0,0), createVector(0,0)),
        // new Particle(20, p5.Vector.fromAngle(0,200), p5.Vector.fromAngle(90,150)),
        // new Particle(25, p5.Vector.fromAngle(90,400), p5.Vector.fromAngle(180,120)),
        // new Particle(15, p5.Vector.fromAngle(270,600), p5.Vector.fromAngle(0,500)),
    ];
}

function windowResized(): void {
    resizeCanvas(windowWidth, windowHeight);
}

function unitDifference(a: p5.Vector, b: p5.Vector): p5.Vector
{
    const diff = p5.Vector.sub(b, a)
    return p5.Vector.div(diff, p5.Vector.mag(diff))
}

function mousePressed() {
    const posX = mouseX - windowWidth / 2;
    const posY = mouseY - windowHeight / 2;
    particles.push(new Particle(
        random(5,15),
        createVector(posX, posY),
        p5.Vector.fromAngle(-atan2(posX, posY), sqrt(bigG * particles[0].mass / p5.Vector.dist(particles[0].position, createVector(posX, posY)))),
    ));
}

function draw(): void {
    background(0);
    fill(225, 200, 30);

    for (const particle of particles) {
        circle(particle.position.x, particle.position.y, particle.radius);
    }
    calculatePhysics();
}

function calculatePhysics(): void
{
    if (particles.length > 1) {
        for (const particle of particles) {
            const lastAcceleration = particle.acceleration
            particle.position.add(p5.Vector.add(p5.Vector.mult(particle.velocity, deltaTime/1000), p5.Vector.mult(lastAcceleration, 0.5 * sq(deltaTime/1000))));

            // Fix dist sq for efficiency
            particle.acceleration = particles
                .filter(p => p != particle)
                .map(p => p5.Vector.mult(unitDifference(particle.position, p.position), p.mass * bigG / (sq(p5.Vector.dist(p.position, particle.position)))))
                .reduce((a,b) => p5.Vector.add(a, b));

            const avgAcceleration = p5.Vector.add(lastAcceleration, particle.acceleration).div(2);
            particle.velocity.add(p5.Vector.mult(avgAcceleration, deltaTime / 1000));

            // wrapParticle(particle);
        }
    }
}

function wrapParticle(particle: Particle)
{
    if (particle.position.x > windowWidth / 2)
    {
        particle.position.x = particle.position.x - windowWidth
    } 
    else if (particle.position.x < -windowWidth / 2)
    {
        particle.position.x = particle.position.x + windowWidth
    }

    if (particle.position.y > windowHeight / 2)
    {
        particle.position.y = particle.position.y - windowHeight
    } 
    else if (particle.position.y < -windowHeight / 2)
    {
        particle.position.y = particle.position.y + windowHeight
    }
}

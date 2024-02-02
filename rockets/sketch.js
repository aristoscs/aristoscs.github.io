let population, lifespan = 400, lifeP, count = 0, target, maxforce = 0.2;
let rx = 100, ry = 150, rw = 200, rh = 10;

function setup() {
  createCanvas(400, 300);
  population = new Population();
  lifeP = createP();
  target = createVector(width / 2, 50);
}

function draw() {
  background(0);
  population.run();
  lifeP.html(count++);
  
  if (count === lifespan) {
    population.evaluate();
    population.selection();
    count = 0;
  }
  
  fill(255);
  rect(rx, ry, rw, rh);
  ellipse(target.x, target.y, 16, 16);
}

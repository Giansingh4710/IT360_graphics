// https://editor.p5js.org/gs4/sketches/aCIDCgEKa

let x = 100;
let y = 100;
let vx = 2;
let vy = 3;
let dt = 0.5;

function setup() {
  createCanvas(400, 400);
}

function updatevxvy(x,y) {
  // Check Boundaries
  if (x > width || x < 0){
    vx = -vx;
  }
  if (y > height || y < 0){
    vy = -vy;
  }

  // update vx,vy according to gravity force
  vx = vx + 0 * dt;
  vy = vy + 9.8 * dt;

}

function draw() {
  background(220);
  // Draw a Circle
  fill(255, 210, 0);
  ellipse(x, y, 25, 25);
  updatevxvy(x,y)
  
  x = x + vx*dt;
  y = y + vy*dt ;
  
}

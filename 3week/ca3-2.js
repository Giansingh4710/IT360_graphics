// https://editor.p5js.org/gs4/sketches/poNb-_t3H

// Turn or thrust the ship depending on what key is pressed
// 90 is the keyCode for 'z' or 'Z'
// text("left right arrows to turn, z to thrust", 10, height - 5);

let ship
let rayStartX
let rayStartY
let rayDirX
let rayDirY
let circleX = 240
let circleY = 240
let circleR = 60
let circleRSq = circleR * circleR

function setup() {
  createCanvas(640, 360)
  ship = new Spaceship()
}

// TODO implement this function to return true/flase in case the ray
// that starts within the ship is within the circle
// Use: rayStartX,rayStartY,circleX,circleY,circleR, and others as needed.
function isInCircle() {
  // Implement here
  d = sqrt((rayStartX - circleX) ** 2 + (rayStartY - circleY) ** 2)
  return d < circleR
}

function draw() {
  background(0)
  // Update location
  ship.update()
  rayStartX = ship.location.x
  rayStartY = ship.location.y
  rayDirX = cos(ship.heading - PI / 2)
  rayDirY = sin(ship.heading - PI / 2)
  // Wrape edges
  ship.wrapEdges()
  // Draw ship
  ship.display()
  if (isInCircle()) {
    fill(255, 165, 0)
  } else {
    fill(0, 0, 0)
  }
  ellipse(circleX, circleY, circleR * 2, circleR * 2)
  line(
    rayStartX,
    rayStartY,
    ship.location.x + 600 * rayDirX,
    ship.location.y + 600 * rayDirY
  )
  // fill(0);
  if (keyIsDown(LEFT_ARROW)) {
    ship.turn(-0.03)
  } else if (keyIsDown(RIGHT_ARROW)) {
    ship.turn(0.03)
  } else if (keyIsDown(90)) {
    ship.thrust()
  }
}

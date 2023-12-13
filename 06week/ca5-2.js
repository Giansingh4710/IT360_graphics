// https://editor.p5js.org/gs4/sketches/mQChvtI5x
let deltas = []
let positions = []
let numDiscs = 30
let radius = 25

ALPHA = 1.0 //TODO find right alpha

function setup() {
  createCanvas(400, 400)
  let randomX = 0,
    randomY = 0
  let ctr = numDiscs
  while (ctr >= 0) {
    // Initialize ball index 0
    randomX = random(width)
    randomY = random(height)
    deltas.push(createVector(0.0, 0.8))
    positions.push(createVector(randomX, randomY))
    ctr = ctr - 1
  }
}

//TODO find the right value of ALPHA s.t. balls
//bounce of walls slow down.
function constrainToBoudary(idx) {
  if (positions[idx].x < 0) {
    positions[idx].x = 0
    deltas[idx].x = -ALPHA * deltas[idx].x
  } else if (positions[idx].x > width) {
    positions[idx].x = width
    deltas[idx].x = -ALPHA * deltas[idx].x
  }

  if (positions[idx].y < 0) {
    positions[idx].y = 0
    deltas[idx].y = -ALPHA * deltas[idx].y
  } else if (positions[idx].y > height) {
    positions[idx].y = height
    deltas[idx].y = -ALPHA * deltas[idx].y
  }
}

//TODO fill in the the missing code below
function resolveCollision(idxA, idxB) {
  let xa = positions[idxA].x
  let xb = positions[idxB].x
  let ya = positions[idxA].y
  let yb = positions[idxB].y
  let normalDirX = xa - xb
  let normalDirY = ya - yb
  let distSq = normalDirX * normalDirX + normalDirY * normalDirY
  let dist = sqrt(distSq)
  let collisionDist = dist - radius
  if (collisionDist < 0 && dist > 0.001) {
    //normalDirX=... normalize the vector normalDirX
    //normalDirY= ...normalize the vector normalDirY
    //positions[idxB].x += ...  move the disc by the collisionDist/2 in the normalDir direction
    //positions[idxB].y += ...  move the disc by the collisionDist/2 in the normalDir direction
    //positions[idxA].x += ...  move the disc by the opposing direction
    //positions[idxA].y += ...  move the disc by the opposing direction
    normalDirX = normalDirX/dist
    normalDirY = normalDirY/dist
    positions[idxB].x += normalDirX*collisionDist/2
    positions[idxB].y += normalDirY*collisionDist/2
    positions[idxA].x += -normalDirX*collisionDist/2
    positions[idxA].y += -normalDirY*collisionDist/2
  }
}

function draw() {
  background(220)
  fill(255, 210, 0)
  for (let i = 0; i < positions.length; i++) {
    for (let j = i; j < positions.length; j++) {
      resolveCollision(i, j)
    }
    delta = constrainToBoudary(i)
    positions[i].x = positions[i].x + deltas[i].x
    positions[i].y = positions[i].y + deltas[i].y
    ellipse(positions[i].x, positions[i].y, radius, radius)
  }
}

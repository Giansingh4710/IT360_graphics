// https://editor.p5js.org/gs4/sketches/lweEP-hgS

let deltas = []
let positions = []
let numDiscs = 30
let radius = 25

function setup() {
  createCanvas(400, 400)
  let randomX = 0,
    randomY = 0
  let ctr = numDiscs
  while (ctr >= 0) {
    // Initialize ball index 0
    randomX = random(width)
    randomY = random(height)
    deltas.push(
      createVector((-5 + random(10)) * 0.16, (-5 + random(10)) * 0.01)
    )
    positions.push(createVector(randomX, randomY))
    ctr = ctr - 1
  }
}

function constrainToBoudary(idx) {
  if (positions[idx].x < 0) {
    positions[idx].x = width
  } else if (positions[idx].x > width) {
    positions[idx].x = 0
  }

  if (positions[idx].y < 0) {
    positions[idx].y = height - 25
    deltas[idx].y = -1 * deltas[idx].y
  } else if (positions[idx].y > height) {
    positions[idx].y = 25
    deltas[idx].y = -1 * deltas[idx].y
  }
}

//TODO correct this function s.t. discs avoid collision
function resolveAgentCollision(idxA, idxB) {
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
    //normalDirX= find the normal vector
    //normalDirY= ..
    //positions[idxB].x += move the agent by collisionDist/2 in the normal nector directio
    //positions[idxB].y += ...
    //positions[idxA].x += move the agent in the opposite direction
    //positions[idxA].y += ...
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
      resolveAgentCollision(i, j)
    }
    delta = constrainToBoudary(i)
    positions[i].x = positions[i].x + deltas[i].x
    positions[i].y = positions[i].y + deltas[i].y
    ellipse(positions[i].x, positions[i].y, radius, radius)
  }
}

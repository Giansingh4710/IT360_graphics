// https://editor.p5js.org/gs4/sketches/jK3Dz6S6H
let velocities = []
let deltaCtrs = []
let deltas = []
let frameRateVals = []
let oldPositions = []
let positions = []
let numDiscs = 1024
let radius = 3
let diameter = radius * 2
timeStep = 0.01
let wind = 0.0
let gravity = 1.0

function setup() {
  createCanvas(400, 400)
  let randomX = 0,
    randomY = 0
  let ctr = numDiscs
  while (ctr >= 0) {
    // Initialize ball index 0
    randomX = random(width)
    randomY = random(height)
    velocities.push(
      createVector((-5 + random(10)) * 0.96, (-5 + random(10)) * 0.34)
    )
    deltaCtrs.push(0)
    deltas.push(createVector((0.0, 0.0)))
    positions.push(createVector(randomX, randomY))
    oldPositions.push(createVector(0, 0))
    ctr = ctr - 1
  }
}

function constrainToBoudary(idx) {
  if (positions[idx].x < radius) {
    positions[idx].x = radius
  } else if (positions[idx].x > width - radius) {
    positions[idx].x = width - radius
  }

  if (positions[idx].y < radius) {
    //positions[idx].y =height -15
    positions[idx].y = radius
  } else if (positions[idx].y > height - radius) {
    positions[idx].y = height - radius
  }
}

function resolveParticleCollisions(idxA, idxB) {
  let xa = positions[idxA].x
  let xb = positions[idxB].x
  let ya = positions[idxA].y
  let yb = positions[idxB].y
  let normalDirX = xa - xb
  let normalDirY = ya - yb
  let distSq = normalDirX * normalDirX + normalDirY * normalDirY
  let dist = sqrt(distSq)
  let collisionDist = dist - 2 * radius
  if (collisionDist < 0 && dist > 0.0001) {
    normalDirX = normalDirX / dist
    normalDirY = normalDirY / dist
    deltas[idxA].x -= (normalDirX * collisionDist) / 2
    deltas[idxA].y -= (normalDirY * collisionDist) / 2
    deltas[idxB].x += (normalDirX * collisionDist) / 2
    deltas[idxB].y += (normalDirY * collisionDist) / 2
    deltaCtrs[idxA] += 1
    deltaCtrs[idxB] += 1
  }
}

function draw() {
  background(220)

  fill(255, 210, 0)
  wind = 0.0
  if (mouseIsPressed == true && mouseButton == LEFT) {
    wind = 5.0
  }
  if (mouseIsPressed == true && mouseButton == RIGHT) {
    wind = -5.0
  }

  for (let i = 0; i < positions.length; i++) {
    constrainToBoudary(i)
    oldPositions[i].x = positions[i].x
    oldPositions[i].y = positions[i].y
    positions[i].x =
      oldPositions[i].x + timeStep * velocities[i].x + timeStep * wind
    positions[i].y =
      oldPositions[i].y + timeStep * velocities[i].y + gravity * timeStep

    deltas[i].x = 0.0
    deltas[i].y = 0.0
    deltaCtrs[i] = 0
    for (let j = 0; j < positions.length; j++) {
      resolveParticleCollisions(i, j)
    }

    if (deltaCtrs[i] > 0) {
      positions[i].x += (1.2 * deltas[i].x) / deltaCtrs[i]
      positions[i].y += (1.2 * deltas[i].y) / deltaCtrs[i]
    }
    constrainToBoudary(i)

    velocities[i].x = (0.9999 * (positions[i].x - oldPositions[i].x)) / timeStep
    velocities[i].y = (0.9999 * (positions[i].y - oldPositions[i].y)) / timeStep

    ellipse(positions[i].x, positions[i].y, diameter, diameter)
  }
}

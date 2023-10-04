// https://editor.p5js.org/gs4/sketches/FhTzPD4dA
let img, imgOrg
let filter = [
  [1, 1, 0],
  [1, 1, 0],
  [1, 1, 0],
]

function preload() {
  img = loadImage('img-tutorial-count-coins-coins2.png')
  imgOrg = loadImage('img-tutorial-count-coins-coins2.png')
}

function setPixelValue(x, y, dx, dy, val) {
  let designated_x = x + dx
  let designated_y = y + dy
  designated_x = min(designated_x, img.width - 1)
  designated_x = max(designated_x, 0)
  designated_y = min(designated_y, img.height - 1)
  designated_y = max(designated_y, 0)
  img.set(designated_x, designated_y, val)
}

function getOperatorValue(x, y) {
  return filter[x][y]
}

function getPixel(x, y, dx, dy) {
  let designated_x = x + dx
  let designated_y = y + dy
  designated_x = min(designated_x, img.width - 1)
  designated_x = max(designated_x, 0)
  designated_y = min(designated_y, img.height - 1)
  designated_y = max(designated_y, 0)
  return imgOrg.get(designated_x, designated_y)
}

function getPixelValue(x, y) {
  let pixel = getPixel(x, y, 0, 0)
  const r = red(pixel)
  const g = green(pixel)
  const b = blue(pixel)
  return (pixelValue = 0.2126 * r + 0.7152 * g + 0.0722 * b)
}

function thresholdOperator(thresholdVal) {
  let yDim = img.height
  let xDim = img.width
  // Loop over every pixel in the image
  for (let y = 0; y < yDim; y++) {
    for (let x = 0; x < xDim; x++) {
      //TODO changes these lines of code
      let pixelValue = getPixelValue(x, y)
      if (pixelValue < thresholdVal) {
        img.set(x, y, pixelValue / 2)
      } else {
        img.set(x, y, pixelValue)
      }
      //TODO end
    }
  }
}

function setup() {
  img.loadPixels()
  createCanvas(1 + 2 * img.width, img.height)
  thresholdOperator(255)
  img.updatePixels()
}

function draw() {
  image(img, 0, 0)
  image(imgOrg, imgOrg.width, 0)
}

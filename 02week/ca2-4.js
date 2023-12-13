// https://editor.p5js.org/gs4/sketches/h8m2knUKw
let img, imgOrg
let filter = [
  [1, 1, 0],
  [1, 1, 0],
  [1, 1, 0],
]

function preload() {
  img = loadImage('dilation.png')
  imgOrg = loadImage('dilation.png')
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

function getPixelValue(x, y, dx, dy) {
  let pixel = getPixel(x, y, dx, dy)
  const r = red(pixel)
  const g = green(pixel)
  const b = blue(pixel)
  return (pixelValue = 0.2126 * r + 0.7152 * g + 0.0722 * b)
}

//TODO: implement this
function dilatePixelArea(x, y) {
  let operatorValue = 0
  let outValue = 0
  let pixelValue = getPixelValue(x, y, 0, 0)
  if (pixelValue > 50) {
    //change to if(pixelValue is 'on')
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        operatorValue = getOperatorValue(dx + 1, dy + 1)
        // if(operatorValue is 'on' )
        // setPixelValue(x,y,dx,dy, someValue);
        if (operatorValue === 1) {
          setPixelValue(x, y, dx, dy, 255, 255)
        }
      }
    }
  }
}

function dilationOperator() {
  let yDim = img.height
  let xDim = img.width
  // Loop over every pixel in the image
  for (let y = 0; y < yDim; y++) {
    for (let x = 0; x < xDim; x++) {
      dilatePixelArea(x, y)
    }
  }
}

function setup() {
  img.loadPixels()
  createCanvas(1 + 2 * img.width, img.height)
  dilationOperator()
  img.updatePixels()
}

function draw() {
  image(img, 0, 0)
  image(imgOrg, imgOrg.width, 0)
}

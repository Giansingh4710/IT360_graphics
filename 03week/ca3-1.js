// https://editor.p5js.org/gs4/sketches/f8m7leJGS

// Sources
// https://happycoding.io/tutorials/p5js/images
// https://nrsyed.com/2018/02/18/edge-detection-in-images-how-to-derive-the-sobel-operator/
// https://observablehq.com/@mbostock/sobel-operator

let img
width = 300
height = 300

let x_filter = [
  [0, 0, 0],
  [-1, 0, 1],
  [0, 0, 0],
]
let y_filter = [
  [0, -1, 0],
  [0, 0, 0],
  [0, 1, 0],
]

let edgeOutput = []

function preload() {
  img = loadImage('https://happycoding.io/images/stanley-1.jpg')
}

function getPixel(x, y, dx, dy) {
  let designated_x = x + dx
  let designated_y = y + dy
  designated_x = min(designated_x, img.width - 1)
  designated_x = max(designated_x, 0)
  designated_y = min(designated_y, img.height - 1)
  designated_y = max(designated_y, 0)
  //print(designated_x,designated_y, x, y)
  return img.get(designated_x, designated_y)
}

function getFilterValueDirX(x, y) {
  return x_filter[x][y]
}

function getFilterValueDirY(x, y) {
  return y_filter[x][y]
}

function getPixelValue(pixel) {
  const r = red(pixel)
  const g = green(pixel)
  const b = blue(pixel)
  return (pixelValue = 0.2126 * r + 0.7152 * g + 0.0722 * b)
}

//TODO: implement this
function getEdgeFilterValue(x, y) {
  let gradX = 0
  let gradY = 0
  let gradValue = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      let pixel = getPixel(x, y, dx, dy)
      const pixelValue = getPixelValue(pixel)
      gradX += pixelValue * getFilterValueDirX(dx + 1, dy + 1)
      gradY += pixelValue * getFilterValueDirY(dx + 1, dy + 1)
    }
  }
  gradValue = sqrt(gradX * gradX + gradY * gradY)
  return gradValue
}

function edgeFilter() {
  let yDim = img.height
  let xDim = min(155, img.width)
  // Loop over every pixel in the image
  for (let y = 0; y < yDim; y++) {
    edgeOutput[y] = []
    for (let x = 0; x < xDim; x++) {
      let v = getEdgeFilterValue(x, y)
      edgeOutput[y][x] = v
    }
  }

  let min_value = edgeOutput[0][0]
  let max_value = edgeOutput[0][0]

  for (let y = 0; y < yDim; y++) {
    for (let x = 0; x < xDim; x++) {
      const curValue = edgeOutput[y][x]
      min_value = min(curValue, min_value)
      max_value = max(curValue, max_value)
    }
  }
  print(min_value, max_value)

  for (let y = 0; y < yDim; y++) {
    for (let x = 0; x < xDim; x++) {
      let curValue = edgeOutput[y][x]
      //let normalizedValue = curValue ;
      let normalizedValue =
        (255 * (curValue - min_value)) / (max_value - min_value)
      let normalizedOutput = color(
        normalizedValue,
        normalizedValue,
        normalizedValue
      )
      img.set(x, y, normalizedOutput)
    }
  }
}

function setup() {
  //print(x_filter[1][2]);
  img.loadPixels()
  createCanvas(img.width, img.height)
  edgeFilter()
  img.updatePixels()
}

function draw() {
  image(img, 0, 0)
}

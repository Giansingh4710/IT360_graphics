// https://editor.p5js.org/gs4/sketches/ihxNasxQs
let img;
width = 300 
height = 300

function preload() {
  img = loadImage("https://happycoding.io/images/stanley-1.jpg");
}
function getAvg(x,y){
  let topleft = img.get(x-1,y-1)
  let topleftR = red(topleft)
  let topleftG = green(topleft)
  let topleftB = blue(topleft)
  
  let topmid = img.get(x,y-1)
  let topmidR = red(topmid)
  let topmidG = green(topmid)
  let topmidB = blue(topmid) 

  let topright = img.get(x+1,y-1)
  let toprightR = red(topright)
  let toprightG = green(topright)
  let toprightB = blue(topright)

  let left = img.get(x-1,y)
  let leftR = red(left)
  let leftG = green(left)
  let leftB = blue(left) 

  let org = img.get(x,y)
  let orgR = red(org)
  let orgG = green(org)
  let orgB = blue(org) 

  let right = img.get(x+1,y)
  let rightR = red(right)
  let rightG = green(right)
  let rightB = blue(right) 

  let btmleft = img.get(x-1,y+1)
  let btmleftR = red(btmleft)
  let btmleftG = green(btmleft)
  let btmleftB = blue(btmleft)

  let btm = img.get(x,y+1)
  let btmR = red(btm)
  let btmG = green(btm)
  let btmB = blue(btm) 

  let btmright = img.get(x+1,y+1)
  let btmrightR = red(btmright)
  let btmrightG = green(btmright)
  let btmrightB = blue(btmright)

  let avgR = (topleftR + topmidR + toprightR + leftR + orgR + rightR + btmleftR + btmR + btmrightR)/9
  let avgG = (topleftG + topmidG + toprightG + leftG + orgG + rightG + btmleftG + btmG + btmrightG)/9
  let avgB = (topleftB + topmidB + toprightB + leftB + orgB + rightB + btmleftB + btmB + btmrightB)/9

  return [avgR,avgG,avgB]
}

// function implements 3x3 filter
function applyMeanFilter(){
  // Loop over every pixel in the image
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let originalColor = img.get(x, y);
      const r = red(originalColor);
      const g = green(originalColor);
      const b = blue(originalColor);
      let outputColor;

      // outputColor = color(r, g, b);
      let colors = getAvg(x,y)
      outputColor = color(colors[0],colors[1],colors[2]);

      // Set the pixel's color 
      img.set(x, y, outputColor);      
    }
  }
}

function setup() {
  img.loadPixels();
  createCanvas(img.width, img.height);
  applyMeanFilter();
  img.updatePixels();  
}

function draw() {
  image(img, 0, 0);
}

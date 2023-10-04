// https://editor.p5js.org/gs4/sketches/C8FNz4ChP
let img;
width = 300 
height = 300

function preload() {
  img = loadImage("https://happycoding.io/images/stanley-1.jpg");
}


function inverseColors(){
  // Loop over every pixel in the image
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      // Read the pixel's color
      let originalColor = img.get(x, y);
      // TODO change the lines below
      const r = 255 - red(originalColor);
      const g =  255 -green(originalColor);
      const b =  255 -blue(originalColor);
      let outputColor = color(r, g, b);
      // TODO no changes needed after this line
      // Set the pixel's color
      img.set(x, y, outputColor);      
    }
  }
}

function setup() {
  img.loadPixels();
  createCanvas(img.width, img.height);
  inverseColors();
  img.updatePixels();  
}

function draw() {
  image(img, 0, 0);
}

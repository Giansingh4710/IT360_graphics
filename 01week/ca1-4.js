// https://editor.p5js.org/gs4/sketches/HovnpAX3u
let img;
width = 300 
height = 300

function preload() {
  img = loadImage("https://happycoding.io/images/stanley-1.jpg");
}


function modifyImage(someValue){
  // Loop over every pixel in the image
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      // Read the pixel's color
      let originalColor = img.get(x, y);
      const r = max(50, min(255, red(originalColor)));
      const g = max(150, min(255, green(originalColor)));
      const b = max(50, min(255, someValue + blue(originalColor)));
      let outputColor = color(r, g, b);
      // Set the pixel's color
      img.set(x, y, outputColor);      
    }
  }
}

function setup() {
  img.loadPixels();
  createCanvas(img.width, img.height);
  modifyImage(0);
  img.updatePixels();  
}

function draw() {
  image(img, 0, 0);
}

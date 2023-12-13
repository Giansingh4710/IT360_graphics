// https://editor.p5js.org/gs4/sketches/M4MHZFV73
let deltas = []; 
let positions =[];
let numDiscs = 30;

function setup() {
  createCanvas(400, 400);
  let randomX=0, randomY=0;
  let ctr = numDiscs;
  while(ctr>=0)
  {
    // Initialize ball index 0
    randomX = random(width);
    randomY = random(height);
    deltas.push(createVector(2,3));
    positions.push(createVector(randomX,randomY));
    ctr=ctr-1;
  }
}

//TODO correct this function s.t. balls 
//bounce of walls 
function moveDisc(idx ) {
  if (positions[idx].x > width || positions[idx].x < 0) {
    deltas[idx].x = deltas[idx].x * -1;
  }
  if (positions[idx].y > height || positions[idx].y < 0) {
    deltas[idx].y = deltas[idx].y * -1;
  }
}



function draw() {
  background(220);  
  fill(255, 210, 0);
  for (let i = 0; i < positions.length; i++) {
    delta = moveDisc (i )
    positions[i].x = positions[i].x  + deltas[i ].x;
    positions[i].y  = positions[i].y  + deltas[i ].y;
    ellipse(positions[i].x, positions[i].y , 25, 25);

  }
    
}

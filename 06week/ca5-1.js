// https://editor.p5js.org/gs4/sketches/Z0j8HDB9A

let deltas = []; 
let positions =[];
let numDiscs = 30;
let radius = 25 

ALPHA = 0.5 //TODO find right alpha 

function setup() {
  createCanvas(400, 400);
  let randomX=0, randomY=0;
  let ctr = numDiscs;
  while(ctr>=0)
  {
    // Initialize ball index 0
    randomX = random(width);
    randomY = random(height);
    deltas.push(createVector(0.0,0.8));
    positions.push(createVector(randomX,randomY));
    ctr=ctr-1;
  }
}

//TODO find the right value of ALPHA s.t. balls 
//bounce of walls slow down.
function constrainToBoudary(idx ) {
  if(positions[idx].x<0) 
  {  
    positions[idx].x=0
    deltas[idx].x = -ALPHA * deltas[idx ].x;
  }
  else if(positions[idx].x>width)
  {
    positions[idx].x=width 
    deltas[idx ].x = -ALPHA * deltas[idx ].x;
  }
  
  if(positions[idx].y<0) 
  {  
    positions[idx].y =0
    deltas[idx ].y = -ALPHA * deltas[idx ].y;
  }
  else if(positions[idx].y>height) 
  {  
    positions[idx].y =height 
    deltas[idx ].y = -ALPHA * deltas[idx ].y;
  }

}



function resolveCollision(idxA,idxB)
{ 
  let xa = positions[idxA].x 
  let xb = positions[idxB].x
  let ya = positions[idxA].y  
  let yb = positions[idxB].y
  let normalDirX = (xa-xb);
  let normalDirY = (ya-yb);  
  let distSq = normalDirX*normalDirX + normalDirY*normalDirY;
  let dist = sqrt(distSq)  
  let collisionDist = dist - radius;
  if(collisionDist<0 && dist > 0.001)
  {
    //normalDirX=...
    //normalDirY= ...
    //positions[idxA].x += ...
    //positions[idxA].y += ...
    //positions[idxB].x += ...
    //positions[idxB].y += ...
  }
 
}

function draw() {
  background(220);  
  fill(255, 210, 0);
  for (let i = 0; i < positions.length; i++) {
    for(let j=i ;j<positions.length;j++)
    {
      resolveCollision(i,j );
    }
    delta = constrainToBoudary (i )
    positions[i].x = positions[i].x  + deltas[i ].x;
    positions[i].y  = positions[i].y  + deltas[i ].y;
    ellipse(positions[i].x, positions[i].y , radius, radius);

  }
    
}

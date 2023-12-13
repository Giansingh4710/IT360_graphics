// https://editor.p5js.org/gs4/sketches/gkrKrJE2y

let deltas = []; 
let positions =[];
let velocities = []; 
let forces  =[];
let numDiscs = 30;
let radius = 25 
let timestep = 0.07
let forcestrength = 0.03
let gravity = 1.0
ALPHA = 1.0 //TODO find right alpha 

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
    forces.push(createVector(0.0,0.0));
    velocities.push(createVector(0.0,2.8));
    ctr=ctr-1;
  }
}

//TODO find the right value of ALPHA s.t. balls 
//bounce of walls slow down.
function constrainToBoudary(idx ) {
  if(positions[idx].x<0) 
  {  
    positions[idx].x=0
    velocities[idx].x = -ALPHA * deltas[idx ].x;
  }
  else if(positions[idx].x>width)
  {
    positions[idx].x=width 
    velocities[idx ].x = -ALPHA * deltas[idx ].x;
  }
  
  if(positions[idx].y<0) 
  {  
    positions[idx].y =0
    velocities[idx ].y = -ALPHA * deltas[idx ].y;
  }
  else if(positions[idx].y>height) 
  {  
    positions[idx].y =height 
    velocities[idx ].y = -ALPHA * deltas[idx ].y;
  }

}


//TODO fill in the psedo code below
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
  let collisionDist = dist - 1.16*radius;
  if(collisionDist<0 && dist > 0.001)
  {
    normalDirX = normalDirX/dist
    normalDirY = normalDirY/dist
    //normalDirX=normalize the vector normalDirX
    //normalDirY=normalize the vector normalDirX
    //velocities[idxB].x += forcestrength * collision normal vector * collision distance 
    //velocities[idxB].y +=  ... 
    //velocities[idxA].x +=  same as above but with opposite vector
    //velocities[idxA].y +=  ...

    velocities[idxB].x += forcestrength * normalDirX * collisionDist
    velocities[idxB].y += forcestrength * normalDirY * collisionDist
    velocities[idxA].x += -forcestrength * normalDirX * collisionDist
    velocities[idxA].y += -forcestrength * normalDirY * collisionDist

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
    velocities[i ].y += gravity * timestep;
    positions[i].x = positions[i].x  + velocities[i ].x * timestep;
    positions[i].y  = positions[i].y  + velocities[i ].y * timestep;
    ellipse(positions[i].x, positions[i].y , radius, radius);
    velocities[i ].y *=0.99
    velocities[i ].x *=0.99
  }
    
}

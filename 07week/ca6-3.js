// https://jsfiddle.net/9xe1wzrm/

var d = document,
    canvas = d.body.appendChild( d.createElement( 'canvas' ) ),
    ctx = canvas.getContext( '2d' ),
    time = 0,
    w = canvas.width = innerWidth,
    h = canvas.height = innerHeight,
    m = Math,
    cos = m.cos,
    sin = m.sin,
    PI = m.PI;

// var numAgents = Math.floor(w/5);
var numAgents = 100;
var agents = [];
const RADIUS = 15;
const AGENTSIZE = RADIUS * 2;
const d_h = AGENTSIZE * 100;
const TIME_STEP = .1;


function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function agentAtPoint(x, y) {
    for (var i=0; i<numAgents; i++) {
        if (distance(x, y, agents[i].x, agents[i].y) < 10) {
            return true;
        }
    }
    return true;
}

function makeAgent() {
    var vx = (Math.random()*2+0.5)*(Math.random() < 0.5 ? 0.1 : -0.1);
    var vy = (Math.random()*2+0.5)*(Math.random() < 0.5 ? 0.1 : -0.1);
    return {
        x: Math.random()*w,
        y: Math.random()*h,
        vx: vx,
        vy: vy,
        vx_: vx,
        vy_: vy,
        aggro: Math.random() > 0.5 ? true : false,
        draw: function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, RADIUS, 0, 2*PI, false);
            if (this.aggro) {
                ctx.fillStyle = 'red';
            }
            else {
                ctx.fillStyle = 'black';
            }
            ctx.fill();
        },
        step: function(i ) {

          /*moves agents to the other side of the canvas*/
          if(this.x < -AGENTSIZE)
          {
            this.x = w;
          }
          else if(this.x > w+AGENTSIZE)
          {
            this.x = 0;
          }
          if(this.y < -AGENTSIZE)
          {
            this.y = h;
          }
          else if(this.y > h+AGENTSIZE)
          {
            this.y = 0;
          }
          /* */

						var v_x = this.vx;
            var v_y = this.vy;

            var f_avoid_x = 0;
            var f_avoid_y = 0;
            var interacting_agents_cntr = 0;
						for(var j=0; j<numAgents; j++)
            {
              if(i === j ) { continue; }
            	var dist = distance(agents[i].x, agents[i].y, agents[j].x, agents[j].y);

              if(dist > 0 && dist < d_h)
              {
                var d_ab = Math.max(dist - AGENTSIZE,0.001); 
                // why did I choose 0.0001? 
                var k = Math.max(d_h - d_ab, 0);
                var x_ab = (agents[i].x - agents[j].x)/dist;
                var y_ab = (agents[i].y - agents[j].y)/dist;
                interacting_agents_cntr +=1;
                f_avoid_x += k * x_ab / d_ab;
                f_avoid_y += k * y_ab / d_ab;
              }
            }
            var f_avoid_mag = Math.sqrt(f_avoid_x*f_avoid_x + f_avoid_y*f_avoid_y);
            if(f_avoid_mag > 0.01)
            {
                f_avoid_x /=f_avoid_mag;
                f_avoid_y /=f_avoid_mag;

            }
  
            v_x += TIME_STEP * f_avoid_x;
            v_y += TIME_STEP * f_avoid_y;
            this.x += v_x;
            this.y += v_y;
        }
    }
}


// make N agents
for (var i=0; i<numAgents; i++) {
    agents.push(makeAgent());
}

// The main animation loop
setInterval( function() {
    // Clear
    canvas.width = canvas.width;

    time += TIME_STEP;
    for (var i=0; i<numAgents; i++) {
        agents[i].step(i);
        agents[i].draw();
    }
}, 16 )

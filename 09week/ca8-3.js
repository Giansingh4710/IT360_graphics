// https://jsfiddle.net/a1j2v64n/

let step = 40
var grid = undefined
var planner = undefined
const epsilon = 0.001

// taken from https://codereview.stackexchange.com/questions/114702/drawing-a-grid-on-canvas
var drawGrid = function (ctx, w, h, step) {
  ctx.beginPath()
  for (var x = 0; x <= w; x += step) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
  }
  // set the color of the line
  ctx.strokeStyle = 'rgb(255,0,0)'
  ctx.lineWidth = 1
  // the stroke will actually paint the current path
  ctx.stroke()
  // for the sake of the example 2nd path
  ctx.beginPath()
  for (var y = 0; y <= h; y += step) {
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
  }
  // set the color of the line
  ctx.strokeStyle = 'rgb(20,20,20)'
  // just for fun
  ctx.lineWidth = 1
  // for your original question - you need to stroke only once
  ctx.stroke()
  if (grid != undefined) {
    ctx.font = '8px serif'
    for (var x = step / 2; x <= grid.w; x += step) {
      for (var y = step / 2; y <= grid.h; y += step) {
        var node = grid.getNodeFromPos({ x: x, y: y })
        if (node != undefined && node.distance != undefined) {
          ctx.fillText(node.distance, x, y)
        }
      }
    }
  }
}

var Node = function (opt) {
  var opt = opt || {}
  this.x = opt.x
  this.y = opt.y
  this.idx = opt.idx
  this.distance = undefined
  this.walkable = opt.walkable === undefined ? true : opt.walkable
  this.flow = undefined
}

var Grid = function (opt) {
  opt = opt || {}
  this.w = opt.w || 8
  this.h = opt.h || 6
  this.nodes = []
  this.step = undefined
  this.w_cells = undefined
  this.h_cells = undefined
  this.cells_per_row = undefined
}

var Planner = function (grid) {
  this.grid = grid
}
Planner.prototype.getVelocity = function (agent) {
  if (agent.idx % 2 == 0) {
    return grid.getPath({ x: agent.x, y: agent.y })
  }
}

Grid.prototype.buildCleanNodes = function (step) {
  this.nodes = []
  this.step = step
  this.w_cells = Math.floor(this.w / step) + 1
  this.cells_per_row = this.w_cells
  this.h_cells = Math.floor(this.h / step)
  var y = 0,
    x = 0,
    idx = 0
  while (y < this.h) {
    x = 0
    while (x < this.w) {
      this.nodes.push(
        new Node({
          x: x,
          y: y,
          idx: idx,
          distance: undefined,
          walkable: true,
        })
      )
      x += step
      idx += 1
    }
    y += step
  }
}

Grid.prototype.getNodeFromPos = function (pos) {
  // check pos in grid bounds
  //var x = pos % this.w;
  //var y = pos / this.h;
  var x_idx = Math.floor(pos.x / this.step)
  var y_idx = Math.floor(pos.y / this.step)
  return this.nodes[x_idx + this.cells_per_row * y_idx]
}

Grid.prototype.buildNodePath = function (pos) {
  var nodeGoal = this.getNodeFromPos(pos)
  nodeGoal.distance = 0
  var neighborsToVisit = [nodeGoal]
  var visitedNeighbors = {}
  visitedNeighbors[nodeGoal.idx] = nodeGoal
  while (neighborsToVisit.length > 0) {
    var nextNeighbor = neighborsToVisit.shift() // [1,2,3] --> [1,2], pops [1]
    visitedNeighbors[nextNeighbor.idx] = nextNeighbor
    // TODO: complete this
    // node.distance  = nextNeighbor.distance + 1
    var neighbors = getNeighbors(this, nextNeighbor)
    var i = 0
    while (i < neighbors.length) {
      if (!neighbors[i].distance) {
        neighborsToVisit.push(neighbors[i])
        neighbors[i].distance = nextNeighbor.distance + 1
      }
      i += 1
    }
    // checks if a hash has a key:
    //if(visitedNeighbors.hasOwnProperty(nnToAdd[ni].idx))
  }
}

Grid.prototype.createFlowField = function () {
  var i = 0
  var node = undefined
  while (i < this.nodes.length) {
    node = this.nodes[i]
    this.nodes[i].flow = { x: 0.0, y: 0.0 }
    var neighbors = getNeighbors(this, node)
    if (neighbors != undefined && neighbors.length > 0) {
      nl = neighbors.length
      var ni = 0
      var dist = node.distance
      selected_node_idx = -1
      while (ni < nl) {
        if (neighbors[ni].distance < dist) {
          selected_node_idx = ni
          dist = neighbors[ni].distance
        }
        ni += 1
      }
      if (selected_node_idx != -1) {
        var selectedNode = neighbors[selected_node_idx]
        var rawDir = { x: selectedNode.x - node.x, y: selectedNode.y - node.y }
        var rawDirMagnitude = Math.sqrt(
          rawDir.x * rawDir.x + rawDir.y * rawDir.y
        )
        if (rawDirMagnitude > epsilon) {
          this.nodes[i].flow = {
            x: rawDir.x / rawDirMagnitude,
            y: rawDir.y / rawDirMagnitude,
          }
        }
      }
    }
    i += 1
  }
}

var lerp = function (x1, x2, alpha) {
  return x1 * alpha + x2 * (1 - alpha)
}

Grid.prototype.getPath = function (pos) {
  var node = this.getNodeFromPos(pos)
  if (node != undefined && node.flow != undefined) {
    return node.flow
  }
}

var getNextNeighbor = function (grid, node, goal) {
  var neighbors = getNeighbors(grid, node)
  nl = neighbors.length
  var ni = 0
  var dist = -1
  selected_node_idx = -1
  while (ni < nl) {
    if (dist == -1) {
      dist = goalDistance(grid, neighbors[ni], goal)
      selected_node_idx = ni
    } else {
      nodeDist = goalDistance(grid, neighbors[ni], goal)
      if (nodeDist < dist) {
        selected_node_idx = ni
        dist = nodeDist
      }
    }
  }
  return neighbors[selected_node_idx]
}

Grid.prototype.getNodeLeft = function (node) {
  var targetIndex = node.idx
  if (targetIndex % this.w_cells != 0) {
    return this.nodes[targetIndex - 1]
  }
}

Grid.prototype.getNodeUp = function (node) {
  var targetIndex = node.idx
  if (targetIndex - this.w_cells >= 0) {
    return this.nodes[targetIndex - this.w_cells]
  }
}

Grid.prototype.getNodeBottom = function (node) {
  var targetIndex = node.idx
  if (Math.floor(targetIndex / this.w_cells) < this.h_cells - 1) {
    return this.nodes[targetIndex + this.w_cells]
  }
}

Grid.prototype.getNodeRight = function (node) {
  var targetIndex = node.idx
  if (Math.floor(targetIndex % this.w_cells) < this.w_cells - 1) {
    return this.nodes[targetIndex + 1]
  }
}

var getNeighbors = function (grid, node) {
  //var neighbors = grid.getNeighbors(node);
  var neighbors = []
  var curNode = grid.getNodeLeft(node)
  if (curNode != undefined) {
    neighbors.push(curNode)
  }
  curNode = grid.getNodeRight(node)
  if (curNode != undefined) {
    neighbors.push(curNode)
  }
  curNode = grid.getNodeUp(node)
  if (curNode != undefined) {
    neighbors.push(curNode)
  }
  curNode = grid.getNodeBottom(node)
  if (curNode != undefined) {
    neighbors.push(curNode)
  }
  return neighbors
}

var d = document,
  canvas = d.body.appendChild(d.createElement('canvas')),
  ctx = canvas.getContext('2d'),
  time = 0,
  w = (canvas.width = innerWidth),
  h = (canvas.height = innerHeight),
  m = Math,
  cos = m.cos,
  sin = m.sin,
  PI = m.PI,
  lastTime = new Date().getTime(),
  frames = 0,
  totalTime = 0,
  updateTime = 0,
  updateFrames = 0

const times = []
var fps = 0.0
var fps_avg = 0.0

function refreshLoop() {
  var now = new Date().getTime()
  delta = now - lastTime
  lastTime = now
  totalTime += delta
  frames++
  updateTime += delta
  updateFrames++
  if (updateTime > 1000) {
    fps = (1000 * frames) / totalTime
    fps_avg = (1000 * updateFrames) / updateTime
    updateTime = 0
    updateFrames = 0
  }
}

var numAgents = 2 * Math.floor(w / 5)
var agents = []
const RADIUS = 4
const AGENTSIZE = RADIUS * 2
const d_h = AGENTSIZE * 3
const TIME_STEP = 0.5
const MAX_SPEED = 1.5
const MAX_FORCE = 0.05

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

function agentAtPoint(x, y) {
  for (var i = 0; i < numAgents; i++) {
    if (distance(x, y, agents[i].x, agents[i].y) < 10) {
      return true
    }
  }
  return true
}

function makeAgent(idx) {
  var vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 0.1 : -0.1)
  var vy = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 0.1 : -0.1)
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: vx,
    vy: vy,
    v_pref: Math.sqrt(vx * vx + vy * vy),
    vx_goal: (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 0.1 : -0.1),
    vy_goal: (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 0.1 : -0.1),
    aggro: Math.random() > 0.5 ? true : false,
    idx: idx,
    draw: function () {
      ctx.beginPath()
      ctx.arc(this.x, this.y, RADIUS, 0, 2 * PI, false)
      if (this.aggro) {
        ctx.fillStyle = 'black'
      } else {
        ctx.fillStyle = 'black'
      }
      ctx.fill()
    },
    step: function (i) {
      /*moves agents to the other side of the canvas*/
      if (this.x < -AGENTSIZE) {
        this.x = w
      } else if (this.x > w + AGENTSIZE) {
        this.x = 0
      }
      if (this.y < -AGENTSIZE) {
        this.y = h
      } else if (this.y > h + AGENTSIZE) {
        this.y = 0
      }
      /* */
      var v_x = this.vx
      var v_y = this.vy
      if (planner != undefined) {
        var planned_v = planner.getVelocity(this)
        if (planned_v != undefined) {
          v_x = this.v_pref * planned_v.x
          v_y = this.v_pref * planned_v.y
        }
      }
      var zeta = 1.0023
      var f_goal_x = (this.vx_goal - v_x) / zeta
      var f_goal_y = (this.vy_goal - v_y) / zeta
      var A = 2000
      var B = 0.08
      var k_repluse = 1.2 * 100000
      var f_avoid_x = 0
      var f_avoid_y = 0
      var f_avoid_ctr = 0
      var interacting_agents_cntr = 0
      for (var j = 0; j < numAgents; j++) {
        if (i === j) continue
        var dist = distance(agents[i].x, agents[i].y, agents[j].x, agents[j].y)
        if (dist > 0 && dist < d_h) {
          var r_ab_sub_dist = AGENTSIZE - dist
          var g_repluse = 0.0
          if (r_ab_sub_dist > 0) {
            g_repluse = r_ab_sub_dist * k_repluse
          }

          var f_avoid_mag = A * Math.exp(r_ab_sub_dist / B) + g_repluse

          var d_ab = Math.max(dist - AGENTSIZE, 0.001)
          //var k = Math.max(d_h - d_ab, 0);
          var x_ab = (agents[i].x - agents[j].x) / dist
          var y_ab = (agents[i].y - agents[j].y) / dist
          interacting_agents_cntr += 1
          f_avoid_x += (f_avoid_mag * x_ab) / d_ab
          f_avoid_y += (f_avoid_mag * y_ab) / d_ab
          f_avoid_ctr = f_avoid_ctr + 1
        }
      }
      if (f_avoid_ctr > 0) {
        f_avoid_x = f_avoid_x / f_avoid_ctr
        f_avoid_y = f_avoid_y / f_avoid_ctr
      }

      //f_goal_x =0 ; f_goal_y = 0;
      var force_sum_x = f_goal_x + f_avoid_x
      var force_sum_y = f_goal_y + f_avoid_y
      var f_avoid_mag = Math.sqrt(
        force_sum_x * force_sum_x + force_sum_y * force_sum_y
      )

      if (f_avoid_mag > MAX_FORCE) {
        force_sum_x = (MAX_FORCE * force_sum_x) / f_avoid_mag
        force_sum_y = (MAX_FORCE * force_sum_y) / f_avoid_mag
      }

      v_x += TIME_STEP * force_sum_x
      v_y += TIME_STEP * force_sum_y
      var speed = Math.sqrt(v_x * v_x + v_y * v_y)
      if (speed > MAX_SPEED) {
        v_x = (MAX_SPEED * v_x) / speed
        v_y = (MAX_SPEED * v_y) / speed
      }

      this.vx = v_x
      this.vy = v_y
      this.x += TIME_STEP * v_x
      this.y += TIME_STEP * v_y
    },
  }
}

// make N agents
for (var i = 0; i < numAgents; i++) {
  agents.push(makeAgent(i))
}

//fps counter

// The main animation loop
setInterval(function () {
  // Clear
  canvas.width = canvas.width

  time += TIME_STEP
  for (var i = 0; i < numAgents; i++) {
    agents[i].step(i)
    agents[i].draw()
  }

  refreshLoop()
  drawGrid(ctx, w, h, step)
  ctx.font = '30px Arial'
  ctx.fillStyle = 'red'
  ctx.fillText('FPS ' + fps.toFixed(1), 10, 50)
}, 16)

var grid = new Grid({ w: w, h: h })
grid.buildCleanNodes(step)
grid.buildNodePath({ x: w / 2, y: h / 2 })
grid.createFlowField()
planner = new Planner(grid)

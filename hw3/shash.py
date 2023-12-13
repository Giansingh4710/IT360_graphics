import glfw
import math
import random
import time
from OpenGL.GL import *

TIMESTEP = 0.025
BOUNDARY_X = 0.5
BOUNDARY_Y = 0.5
MAX_MOVE = 2
CIRCLE_RADIUS = 15
AGENT_SIZE = CIRCLE_RADIUS * 2
NUM_CIRCLES = 100
MAX_FORCE = 2
MAX_SPEED = 1.5
last_time = time.time_ns()
frames = 0
total_time = 0
update_time = 0
update_frames = 0
previous_fps = 0
previous_avg = 0
fps = 0.0
fps_avg = 0.0
window_height = 800
window_width = 800
divisions = 10
num_cells = divisions**2
cell_w = window_width // divisions
cell_h = window_height // divisions
grid_w = divisions
spatial_hash = {k: [] for k in range(num_cells)}


def get_grid_cell(x, y):
    return (x // cell_w) + (y // cell_h) * grid_w


if not glfw.init():
    exit()

window = glfw.create_window(800, 800, "Crowd Avoidance using Spatial Hash", None, None)

if not window:
    glfw.terminate()
    exit()

glfw.make_context_current(window)

circles = []

for i in range(NUM_CIRCLES):
    circle = {
        "x": random.randint(0, window_width),
        "y": random.randint(0, window_height),
        "v_x": random.uniform(-MAX_MOVE, MAX_MOVE),
        "v_y": random.uniform(-MAX_MOVE, MAX_MOVE),
        "v_x_goal": random.uniform(-MAX_MOVE, MAX_MOVE),
        "v_y_goal": random.uniform(-MAX_MOVE, MAX_MOVE),
    }
    circles.append(circle)


def update_spatial_hash():
    for c in circles:
        x, y = c["x"], c["y"]
        grid_cell = get_grid_cell(x, y)
        spatial_hash[grid_cell].append(c)


def distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))


def update_circles():
    for i in range(NUM_CIRCLES):
        circle = circles[i]
        circle["x"] += circle["v_x"]
        circle["y"] += circle["v_y"]

        if circle["x"] < 1:
            circle["x"] = window_width - 1
        if circle["y"] < 1:
            circle["y"] = window_height - 1
        if circle["x"] > window_width - 1:
            circle["x"] = 1
        if circle["y"] > window_height - 1:
            circle["y"] = 1

        circle1x, circle1y = circle["x"], circle["y"]
        grid_cell = get_grid_cell(circle1x, circle1y)
        check(circle, grid_cell)

        adjusted_x = circle1x - cell_w
        adjusted_y_upper = circle1y + cell_h
        adjusted_y_lower = circle1y - cell_h

        if adjusted_x < 1:
            adjusted_x = window_width - 10
        if adjusted_x > window_width - 1:
            adjusted_x = 10
        if adjusted_y_upper > window_height - 1:
            adjusted_y_upper = 10
        if adjusted_y_lower < 1:
            adjusted_y_lower = window_height - 1

        left_grid_cell = get_grid_cell(adjusted_x, circle1y)
        left_upper_cell = get_grid_cell(adjusted_x, adjusted_y_upper)
        left_lower_cell = get_grid_cell(adjusted_x, adjusted_y_lower)

        check(circle, left_grid_cell)
        check(circle, left_upper_cell)
        check(circle, left_lower_cell)


def check(circle, grid_cell):
    if len(spatial_hash[grid_cell]) < 2:
        return
    for curr in spatial_hash[grid_cell]:
        if circle is curr:
            continue
        update_circle_velocity(circle, curr)


def update_circle_velocity(circle, circle2):
    circle1x = circle["x"]
    circle1y = circle["y"]
    circle2x = circle2["x"]
    circle2y = circle2["y"]
    zeta = 1.0023
    vx = circle["v_x"]
    vy = circle["v_y"]
    f_goal_x = (circle["v_x_goal"] - vx) / zeta
    f_goal_y = (circle["v_x_goal"] - vy) / zeta
    force_sum_x, force_sum_y = get_force(
        circle1x, circle1y, circle2x, circle2y, f_goal_x, f_goal_y
    )
    vx += TIMESTEP * force_sum_x
    vy += TIMESTEP * force_sum_y
    speed = math.sqrt(vx * vx + vy * vy)
    if speed > MAX_SPEED:
        vx = MAX_SPEED * vx / speed
        vy = MAX_SPEED * vy / speed
    circle["v_x"] = vx
    circle["v_y"] = vy
    circle["x"] += TIMESTEP * vx
    circle["y"] += TIMESTEP * vy


def get_force(x, y, a, b, f_goal_x, f_goal_y):
    distance = math.sqrt((a-x)*(a-x)+(b-y)*(b-y))
    favoidx = 0
    favoidy = 0
    favoidctr = 0
    avoidanceD = AGENT_SIZE * 2
    if 0 < distance < avoidanceD:
        d_circle = max(distance - AGENT_SIZE, 0.001)
        k = 0.75 * max(AGENT_SIZE * 3 - d_circle, 0)
        x_ab = (x - a) / distance
        y_ab = (y - b) / distance
        favoidx += k * x_ab / d_circle
        favoidy += k * y_ab / d_circle
        favoidctr += 1
    if favoidctr > 0:
        favoidx = favoidx / favoidctr
        favoidy = favoidy / favoidctr
    force_sum_x = f_goal_x + favoidx
    force_sum_y = f_goal_y + favoidy
    f_avoid_mag = math.sqrt(force_sum_x * force_sum_x + force_sum_y * force_sum_y)
    if f_avoid_mag > MAX_FORCE:
        force_sum_x = MAX_FORCE * force_sum_x / f_avoid_mag
        force_sum_y = MAX_FORCE * force_sum_y / f_avoid_mag
    return force_sum_x, force_sum_y


def draw_circle(x, y, r, number_of_segments):
    glColor(0.0, 0.0, 0.0)
    glLineWidth(2.0)
    glBegin(GL_LINE_LOOP)
    for i in range(360):
        theta = i * (math.pi / 180)
        glVertex2d(x + r * math.cos(theta), y + r * math.sin(theta))
    glEnd()

    glColor(0.807, 0.0, 0.0)
    glBegin(GL_POLYGON)
    for i in range(360):
        theta = i * (math.pi / 180)
        glVertex2d(x + r * math.cos(theta), y + r * math.sin(theta))
    glEnd()


def get_fps():
    global last_time, total_time, frames, update_time, update_frames, fps, fps_avg
    now = time.time_ns()
    delta = now - last_time
    last_time = now
    total_time += delta
    update_time += delta
    frames += 1
    update_frames += 1
    if update_time > 1000000000:
        fps = 1000000000 * frames / total_time
        fps_avg = 1000000000 * update_frames / update_time
        update_time = 0
        update_frames = 0
    return fps_avg, fps


while not glfw.window_should_close(window):
    glClearColor(0.870, 0.905, 0.937, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)
    time.sleep(TIMESTEP)

    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    glOrtho(0, window_width, 0, window_height, -1, 1)

    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()

    update_circles()

    for i in spatial_hash:
        spatial_hash[i] = []

    update_spatial_hash()

    for circle in circles:
        glPushMatrix()
        draw_circle(circle["x"], circle["y"], CIRCLE_RADIUS, 1000)
        glPopMatrix()

    curr_fps, overall_avg = get_fps()
    curr_fps = round(curr_fps)
    overall_avg = round(overall_avg)

    if previous_fps != curr_fps:
        print(f"Current FPS: {curr_fps}\nOverall FPS Average: {overall_avg}")
        previous_fps = curr_fps

    glfw.swap_buffers(window)
    glfw.poll_events()

glfw.terminate()
